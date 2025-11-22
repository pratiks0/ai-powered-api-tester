import { useRequestContext } from '../context/RequestContext';

export const useRequest = () => {
  const context = useRequestContext();
  console.log('useRequest hook called', context);
  return context;
};