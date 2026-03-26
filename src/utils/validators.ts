export const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
};

export const validateConfirmPassword = (password: string, confirm: string): string | null => {
    if (password !== confirm) return 'Passwords do not match';
    return null;
};

export const validateMalawiNationalId = (id: string): string | null => {
  if (!id) return 'National ID is required';
  const idRegex = /^[A-Z0-9]{8}$/;
  if (!idRegex.test(id)) return 'National ID must be exactly 8 alphanumeric characters';
  return null;
};
