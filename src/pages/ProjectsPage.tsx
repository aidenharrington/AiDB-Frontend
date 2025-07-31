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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../service/ProjectService';
import { useAuth } from '../context/AuthProvider';
import { authGuard } from '../util/AuthGuard';
import { Project } from '../types/Project';
import { ProjectCreateRequest } from '../types/dtos/ProjectCreateRequest';

export default function ProjectsPage() {
    const { token, user } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log(user, token);
                const result = await authGuard(user, token, getProjects);
                setProjects(result);
                setFilteredProjects(result);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchTerm, projects]);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;
        setCreating(true);
        try {
            const projectCreateRequest: ProjectCreateRequest = { name: newProjectName }
            const newProject = await authGuard(user, token, createProject, projectCreateRequest);
            setDialogOpen(false);
            setNewProjectName('');
            navigate(`/projects/${newProject.id}`);
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setCreating(false);
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
        <Box sx={{ p: 4 }}>
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
                {/* Create Project Button Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                        scrollSnapAlign: 'center',
                        flex: '0 0 auto',
                        width: 300,
                        cursor: 'pointer',
                    }}
                    onClick={() => setDialogOpen(true)}
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

                {/* Existing Projects */}
                {filteredProjects.map((project) => (
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
                        onClick={() => navigate(`/projects/${project.id}`)}
                    >
                        <Card
                            elevation={6}
                            sx={{
                                height: 180,
                                borderRadius: 4,
                                background: theme.palette.background.paper,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {project.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </Box>

            {/* Create Project Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        disabled={creating}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} disabled={creating}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateProject} variant="contained" disabled={creating}>
                        {creating ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
