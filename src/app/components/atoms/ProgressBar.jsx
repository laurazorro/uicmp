import PropTypes from 'prop-types';
import React from 'react';

function getPasswordStrength(password) {
    const requirements = {
        hasLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasSpecialChar: /[!@#$%^&*+\-()/;?,._~":{}|<=>]/.test(password),
        hasNumber: /\d/.test(password),
        hasMinLength: password.length >= 10,
        hasMaxLength: password.length >= 12
    };
    
    const baseRequirements = [requirements.hasLength, requirements.hasUpperCase, requirements.hasLowerCase, requirements.hasSpecialChar, requirements.hasNumber];

    // Cuarta condición: 100% cuando cumpla con todas + 12 caracteres
    if (baseRequirements.every(Boolean) && requirements.hasMinLength && requirements.hasMaxLength) {
        return 100;
    }

    // Tercera condición: 75% cuando cumpla con las 5 condiciones básicas + 10 caracteres
    if (baseRequirements.every(Boolean) && requirements.hasMinLength) {
        return 75;
    }

    // Segunda condición: 50% cuando cumpla con las 5 condiciones básicas
    if (baseRequirements.every(Boolean)) {
        return 50;
    }

    // Primera condición: 25% cuando se escriba algo
    if (password) {
        return 25;
    }

    // Por defecto: 0%
    return 0;

}

function passLabel(value){
    switch(value){
        case 25: 
            return 'No válida';
        case 50: 
            return 'Débil';
        case 75: 
            return 'Mejor';
        case 100: 
            return 'Ideal';
        default:
            return '';
    }
}

export default function ProgressBar({ password }) {
    const value = getPasswordStrength(password);

    let borderClass = 'danger';
    if (value == 100) {
    borderClass = 'primary';
    } else if (value == 75) {
    borderClass = 'success';
    } else if (value == 50) {
    borderClass = 'warning';
    }

    const color = borderClass;

    const colors = {
        primary: 'bg-green-500',
        success: 'bg-lime-400',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        secondary: 'bg-gray-500'
    };

    const colorsText = {
        primary: 'text-green-500',
        success: 'text-lime-400',
        warning: 'text-yellow-500',
        danger: 'text-red-500',
        secondary: 'text-gray-500'
    };

    return (
        <div className="w-full mt-1">
            <div className="relative h-auto">
                <div className={`absolute inset-0 h-1 bg-gray-200 rounded-full`}>
                    <div 
                        className={`h-full rounded-full transition-all duration-300 ${colors[color]}`} 
                        style={{ width: `${value}%` }}
                    >
                    </div>
                    <p className={`text-xs text-end font-medium ${colorsText[color]}`}>{passLabel(value)}</p>
                </div>
            </div>
        </div>
    );
}

ProgressBar.propTypes = {
    password: PropTypes.string
};

ProgressBar.defaultProps = {
    password: ''
};