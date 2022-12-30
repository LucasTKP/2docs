import { useContext } from 'react';
import AppContext from '../components/AppContext';

export default function Loading() {
    const context = useContext(AppContext)
    setTimeout(() => {
      context.setLoading(false)
    }, 20000)
  return (
    <div>
      {context.loading ? 
        <div className='w-screen h-screen fixed z-[20] bg-black/40 flex items-center justify-center'>
          <svg className="animate-spin h-[50px] w-[50px] mr-3  border-[5px] border-t-strong rounded-full" viewBox="0 0 24 24"></svg>
        </div>
      : <></> }
    </div>
  );
}