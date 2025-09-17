export interface PasswordValidationResult {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    errors: string[];
    suggestions: string[];
}

export class PasswordValidator {
    /**
     * Validates password strength and returns detailed feedback
     */
    static validatePassword(password: string): PasswordValidationResult {
        const errors: string[] = [];
        const suggestions: string[] = [];
        
        // Check minimum length
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        // Check for common weak patterns
        if (password.length < 8) {
            suggestions.push('Consider using at least 8 characters for better security');
        }
        
        // Check for variety of character types
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!hasLowercase) {
            suggestions.push('Add lowercase letters');
        }
        if (!hasUppercase) {
            suggestions.push('Add uppercase letters');
        }
        if (!hasNumbers) {
            suggestions.push('Add numbers');
        }
        if (!hasSpecialChars) {
            suggestions.push('Add special characters');
        }
        
        
        // Calculate strength
        let strength: 'weak' | 'medium' | 'strong' = 'weak';
        let score = 0;
        
        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (hasLowercase) score += 1;
        if (hasUppercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;
        if (password.length >= 10) score += 1;
        
        if (score >= 5) strength = 'strong';
        else if (score >= 3) strength = 'medium';
        else strength = 'weak';
        
        const isValid = errors.length === 0 && password.length >= 6;
        
        return {
            isValid,
            strength,
            errors,
            suggestions
        };
    }
    
    /**
     * Gets a user-friendly strength description
     */
    static getStrengthDescription(strength: 'weak' | 'medium' | 'strong'): string {
        switch (strength) {
            case 'weak':
                return 'Weak password';
            case 'medium':
                return 'Medium strength password';
            case 'strong':
                return 'Strong password';
            default:
                return 'Password strength unknown';
        }
    }
    
    /**
     * Gets color for strength indicator
     */
    static getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
        switch (strength) {
            case 'weak':
                return '#f44336'; // Red
            case 'medium':
                return '#ff9800'; // Orange
            case 'strong':
                return '#4caf50'; // Green
            default:
                return '#9e9e9e'; // Grey
        }
    }
}
