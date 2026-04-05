import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = "Crain of World";
    document.title = title ? `${title} | ${originalTitle}` : originalTitle;
    return () => { document.title = originalTitle; };
  }, [title]);
};
