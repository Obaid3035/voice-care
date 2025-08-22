export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex items-center space-x-2'>
        <div className='w-6 h-6 border-2 border-[rgb(var(--primary))]/30 border-t-[rgb(var(--primary))] rounded-full animate-spin' />
        <span className='text-[rgb(var(--text-secondary))]'>Loading...</span>
      </div>
    </div>
  );
}
