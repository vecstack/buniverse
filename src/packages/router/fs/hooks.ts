import useServerContext from '../../../hooks/useContext';

export const useParams = () => {
  const context = useServerContext();
  if (!context.params) {
    throw new Error('useParams() must be used inside a route handler');
  }

  return context.params as Record<string, string>;
};
