#!/usr/bin/env python3
"""
Script to batch add page titles to all remaining page.tsx files
This script reads the file, finds the component definition, and adds the usePageTitle hook
"""

import os
import re
from pathlib import Path

# Title mappings based on file paths
TITLE_MAP = {
    # Admin pages
    'admin/admin/admin': 'Admin - Admin Management Page',
    'admin/admin/log': 'Admin - Admin Log Page',
    'admin/admin/status': 'Admin - Admin Status Page',
    'admin/alert': 'Admin - Alerts Page',
    'admin/board/bulletin': 'Admin - Bulletin Page',
    'admin/board/comments': 'Admin - Comments Page',
    'admin/board/events': 'Admin - Events Page',
    'admin/board/notifications': 'Admin - Notifications Page',
    # Add more mappings as needed
}

def get_title_from_path(file_path):
    """Generate title from file path"""
    # Remove common prefixes and suffixes
    path = str(file_path)
    path = path.replace('frontend/src/src/app/', '')
    path = path.replace('/page.tsx', '')
    path = path.replace('(admin)/admin/', 'admin/')
    path = path.replace('(partner)/partner/', 'partner/')
    path = path.replace('(main)/', '')
    
    # Convert path to title
    parts = path.split('/')
    if parts[0] == 'admin':
        page_name = ' '.join(parts[1:]) if len(parts) > 1 else 'Dashboard'
        return f"Admin - {format_page_name(page_name)} Page"
    elif parts[0] == 'partner':
        page_name = ' '.join(parts[1:]) if len(parts) > 1 else 'Dashboard'
        return f"Partner - {format_page_name(page_name)} Page"
    else:
        page_name = ' '.join(parts) if parts else 'Home'
        return f"TOTOCLUB - {format_page_name(page_name)} Page"

def format_page_name(name):
    """Convert kebab-case/snake_case to Title Case"""
    if not name:
        return 'Home'
    # Replace dashes and underscores with spaces
    name = name.replace('-', ' ').replace('_', ' ')
    # Capitalize each word
    return ' '.join(word.capitalize() for word in name.split())

def add_title_to_file(file_path):
    """Add usePageTitle hook to a page.tsx file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has usePageTitle
        if 'usePageTitle' in content:
            print(f"✓ Already has title: {file_path}")
            return False
        
        # Get title
        title = get_title_from_path(file_path)
        
        # Find component definition patterns
        patterns = [
            (r'(const\s+\w+:\s*React\.FC\s*=\s*\(\)\s*=>\s*\{)', r'\1\n  usePageTitle("' + title + '");'),
            (r'(export\s+default\s+function\s+\w+\([^)]*\)\s*\{)', r'\1\n  usePageTitle("' + title + '");'),
            (r'(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)', r'\1\n  usePageTitle("' + title + '");'),
        ]
        
        # Try to add hook after component definition
        modified = False
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                modified = True
                break
        
        # Add import if not present
        if modified and 'import { usePageTitle }' not in content:
            # Find last import statement
            import_pattern = r'(import\s+[^;]+;)'
            imports = list(re.finditer(import_pattern, content))
            if imports:
                last_import = imports[-1]
                insert_pos = last_import.end()
                content = content[:insert_pos] + '\nimport { usePageTitle } from "@/hooks/usePageTitle";' + content[insert_pos:]
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Added title to: {file_path}")
            return True
        else:
            print(f"✗ Could not find component pattern in: {file_path}")
            return False
            
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all page.tsx files"""
    base_dir = Path('frontend/src/src/app')
    
    if not base_dir.exists():
        print(f"Error: {base_dir} does not exist")
        return
    
    page_files = list(base_dir.rglob('page.tsx'))
    print(f"Found {len(page_files)} page.tsx files")
    
    processed = 0
    skipped = 0
    
    for page_file in page_files:
        if add_title_to_file(page_file):
            processed += 1
        else:
            skipped += 1
    
    print(f"\nProcessed: {processed}, Skipped: {skipped}")

if __name__ == '__main__':
    main()

