import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const siteName = "Crain's World";
    document.title = title ? `${title} | ${siteName}` : siteName;
    return () => { document.title = siteName; };
  }, [title]);
};
