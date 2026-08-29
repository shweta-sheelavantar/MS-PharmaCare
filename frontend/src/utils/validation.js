export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export function validateuserName(value) {
  if (!value || !/^[A-Za-z\s]{2,50}$/.test(value.trim())) {
    return 'Username must be 2-50 alphabetic characters';
  }
  return '';
}

export function validateEmail(value) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Email must be in a valid format';
  }
  return '';
}

export function validateMobile(value) {
  if (!/^[0-9]{10}$/.test(value)) {
    return 'Mobile number must be exactly 10 digits';
  }
  return '';
}

export function validatePassword(value) {
  if (!PASSWORD_REGEX.test(value)) {
    return 'Password must be at least 8 characters with uppercase, lowercase, digit, and special character';
  }
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
}

export function validateOtp(value) {
  if (!/^[0-9]{6}$/.test(value)) {
    return 'OTP must be exactly 6 digits';
  }
  return '';
}
