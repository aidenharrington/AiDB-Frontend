import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    IconButton,
    CardActions,
    Alert,
} from '@mui/material';
import { Add, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../service/ProjectService';
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from '../util/AuthGuard';
import { Project } from '../types/Project';
import { ProjectCreateRequest } from '../types/dtos/ProjectCreateRequest';
import MainLayout from '../components/Layout/MainLayout';
import { formatLimitDisplay, isLimitReached } from '../util/LimitDisplayUtil';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

export default function ProjectsPage() {
    const { token, user } = useAuth();
    const { updateTierIfNotNull, tier, fetchTierIfNeeded } = useTier();
    const theme = useTheme();
    const navigate = useNavigate();
    


    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [creating, setCreating] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Fetch tier info if needed when page loads
    useEffect(() => {
        if (token && !tier) {
            fetchTierIfNeeded(token);
        }
    }, [token, tier, fetchTierIfNeeded]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setError(null);
                const result = await authGuard(user, token, getProjects);
                setProjects(result.projects);
                setFilteredProjects(result.projects);
                updateTierIfNotNull(result.tier);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
                setFilteredProjects([]);
                setError(error instanceof Error ? error.message : 'Failed to fetch projects');
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchProjects();
        }
    }, [user, token, updateTierIfNotNull]);

    useEffect(() => {
        if (Array.isArray(projects)) {
            const filtered = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchTerm, projects]);

    const validateProjectName = (name: string): string | null => {
        if (!name.trim()) {
            return 'Project name is required.';
        }
        
        if (name.trim().length < 3) {
            return 'Project name must be at least 3 characters long.';
        }
        
        if (name.trim().length > 50) {
            return 'Project name must be less than 50 characters long.';
        }
        
        // Check if project name already exists (case-insensitive)
        const existingProject = projects.find(
            project => project.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingProject) {
            return 'A project with this name already exists.';
        }
        
        return null;
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;
        
        // Validate project name
        const nameValidationError = validateProjectName(newProjectName);
        if (nameValidationError) {
            setValidationError(nameValidationError);
            return;
        }
        
        // Check project limit
        if (tier) {
            if (isLimitReached(tier.projectLimitUsage, tier.projectLimit)) {
                const limit = parseInt(tier.projectLimit);
                const limitText = limit === -1 ? '∞' : limit.toString();
                setError(`You have reached your project limit of ${limitText} for your ${tier.name} tier.`);
                return;
            }
        }
        
        setCreating(true);
        try {
            const projectCreateRequest: ProjectCreateRequest = { name: newProjectName }
            const result = await authGuard(user, token, createProject, projectCreateRequest);
            setDialogOpen(false);
            setNewProjectName('');
            setValidationError(null);
            updateTierIfNotNull(result.tier);
            navigate(`/projects/${result.project.id}`);
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteClick = (project: Project, event: React.MouseEvent) => {
        event.stopPropagation();
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;
        
        setDeleting(true);
        try {
            const result = await authGuard(user, token, deleteProject, projectToDelete.id);
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
            setFilteredProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
            updateTierIfNotNull(result.tier);
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error('Failed to delete project:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewProjectName('');
        setValidationError(null);
    };

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewProjectName(value);
        
        // Clear validation error when user starts typing
        if (validationError) {
            setValidationError(null);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainLayout>
            <Box>
                {error && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                        <Typography variant="body2">
                            Error: {error}
                        </Typography>
                    </Box>
                )}
                

                
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Projects"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 4 }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 4,
                        scrollSnapType: 'x mandatory',
                        px: 2,
                    }}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                            scrollSnapAlign: 'center',
                            flex: '0 0 auto',
                            width: 300,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setDialogOpen(true);
                            setValidationError(null);
                        }}
                    >
                        <Card
                            elevation={6}
                            sx={{
                                height: 180,
                                borderRadius: 4,
                                background: theme.palette.background.default,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Add sx={{ fontSize: 40 }} />
                                <Typography variant="h6" fontWeight="bold" mt={1}>
                                    Create Project
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {Array.isArray(filteredProjects) && filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            style={{
                                scrollSnapAlign: 'center',
                                flex: '0 0 auto',
                                width: 300,
                                cursor: 'pointer',
                            }}
                        >
                            <Card
                                elevation={6}
                                sx={{
                                    height: 180,
                                    borderRadius: 4,
                                    background: theme.palette.background.paper,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                }}
                            >
                                <CardContent 
                                    sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        pt: 3
                                    }}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {project.name}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ 
                                    justifyContent: 'center', 
                                    pb: 2,
                                    pt: 0
                                }}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => handleDeleteClick(project, e)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'error.light',
                                                color: 'error.contrastText'
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </motion.div>
                    ))}
                </Box>

                {tier && (
                    <Box sx={{ mt: 3, textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                            {tier.name} Tier: {formatLimitDisplay(tier.projectLimitUsage, tier.projectLimit)} projects used
                        </Typography>
                    </Box>
                )}

                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ pb: 3 }}>Create New Project</DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {validationError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {validationError}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            fullWidth
                            label="Project Name"
                            value={newProjectName}
                            onChange={handleProjectNameChange}
                            disabled={creating}
                            error={!!validationError}
                            helperText={validationError ? '' : 'Enter a unique project name'}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} disabled={creating}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateProject} 
                            variant="contained" 
                            disabled={creating || (tier ? isLimitReached(tier.projectLimitUsage, tier.projectLimit) : false) || !!validationError}
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <DeleteConfirmationDialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Project"
                    message="This will permanently delete the project and all its associated tables and data."
                    itemName={projectToDelete?.name || ''}
                    loading={deleting}
                />
            </Box>
        </MainLayout>
    );
}
