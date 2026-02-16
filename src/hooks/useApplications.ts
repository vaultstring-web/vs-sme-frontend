import { useContext, useEffect } from 'react'; // <-- ADD useEffect
import { ApplicationDetail, ApplicationsContext } from '../context/ApplicationsContext';

// ===== ADD optional parameter =====
export const useApplications = (initialApplication?: ApplicationDetail) => {
  const context = useContext(ApplicationsContext);
  
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }

  // ===== ADD this effect =====
  useEffect(() => {
    if (initialApplication) {
      context.setCurrentApplication(initialApplication);
    }
    // Optional cleanup – uncomment if you want to clear when unmounting
    // return () => {
    //   context.setCurrentApplication(null);
    // };
  }, [initialApplication, context]);

  return context;
};