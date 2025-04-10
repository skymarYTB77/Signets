export function convertToBoltUrl(url: string): string {
  try {
    const githubRegex = /^https?:\/\/github\.com\/([^\/]+\/[^\/]+)/;
    const match = url.match(githubRegex);
    
    if (match) {
      const repoPath = match[1];
      return `https://bolt.new/~/github.com/${repoPath}`;
    }
    
    return url;
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'URL:', error);
    return url;
  }
}