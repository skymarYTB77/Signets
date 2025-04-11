export function convertToBoltUrl(url: string): string {
  try {
    // Regex pour GitHub
    const githubRegex = /^https?:\/\/github\.com\/([^\/]+\/[^\/]+)/;
    const githubMatch = url.match(githubRegex);
    
    if (githubMatch) {
      const repoPath = githubMatch[1];
      return `https://bolt.new/~/github.com/${repoPath}`;
    }
    
    // Regex pour Figma
    const figmaRegex = /^https?:\/\/(?:www\.)?figma\.com\/(file|design)\/([^?]+)/;
    const figmaMatch = url.match(figmaRegex);
    
    if (figmaMatch) {
      const [, type, path] = figmaMatch;
      const queryString = url.includes('?') ? url.split('?')[1] : '';
      return `https://bolt.new/~/figma.com/${type}/${path}${queryString ? '?' + queryString : ''}`;
    }
    
    return url;
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'URL:', error);
    return url;
  }
}

export function detectUrlType(url: string): 'github' | 'figma' | 'bolt' | 'other' {
  if (url.match(/^https?:\/\/github\.com/)) {
    return 'github';
  }
  if (url.match(/^https?:\/\/(?:www\.)?figma\.com/)) {
    return 'figma';
  }
  if (url.match(/^https?:\/\/bolt\.new/)) {
    return 'bolt';
  }
  return 'other';
}