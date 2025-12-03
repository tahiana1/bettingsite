/**
 * Helper function to generate page titles based on route paths
 * This can be used to automatically generate titles for pages
 */

export function generatePageTitle(path: string, section: 'main' | 'admin' | 'partner' = 'main'): string {
  // Remove leading/trailing slashes and split
  const parts = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  
  // Remove route groups (parentheses)
  const cleanParts = parts.filter(p => !p.startsWith('('));
  
  if (section === 'admin') {
    if (cleanParts.includes('users') && cleanParts.includes('main')) {
      return 'Admin - User Management Page';
    }
    if (cleanParts.includes('users') && cleanParts.includes('pending')) {
      return 'Admin - Pending Users Page';
    }
    if (cleanParts.includes('users') && cleanParts.includes('blocked')) {
      return 'Admin - Blocked Users Page';
    }
    if (cleanParts.includes('users') && cleanParts.includes('status')) {
      return 'Admin - User Status Page';
    }
    if (cleanParts.includes('auth') && cleanParts.includes('login')) {
      return 'Admin - Login Page';
    }
    // Add more admin-specific mappings as needed
    const pageName = cleanParts[cleanParts.length - 1] || 'Dashboard';
    return `Admin - ${formatPageName(pageName)}`;
  }
  
  if (section === 'partner') {
    if (cleanParts.includes('member-management') && cleanParts.includes('directMemberList')) {
      return 'Partner - User Management Page';
    }
    if (cleanParts.includes('auth') && cleanParts.includes('login')) {
      return 'Partner - Login Page';
    }
    // Add more partner-specific mappings as needed
    const pageName = cleanParts[cleanParts.length - 1] || 'Dashboard';
    return `Partner - ${formatPageName(pageName)}`;
  }
  
  // Main/public pages
  if (cleanParts.includes('auth') && cleanParts.includes('signIn')) {
    return 'TOTOCLUB - Login Page';
  }
  if (cleanParts.includes('auth') && cleanParts.includes('signup')) {
    return 'TOTOCLUB - Sign Up Page';
  }
  if (cleanParts.length === 0 || cleanParts.includes('home')) {
    return 'TOTOCLUB - Home Page';
  }
  
  const pageName = cleanParts[cleanParts.length - 1] || 'Home';
  return `TOTOCLUB - ${formatPageName(pageName)} Page`;
}

function formatPageName(name: string): string {
  // Convert kebab-case, snake_case, or camelCase to Title Case
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

