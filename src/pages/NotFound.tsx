import ilustration from '@/assets/ilustrations/undraw_page_not_found.svg';

const PageNotFound = () => {
    return ( <div className="flex flex-col gap-3 justify-center items-center h-full">

        <p className='text-xl font-semibold text-red-500'>Página não encontrada</p>
        
        <img src={ilustration} className='w-96 my-8'/>
    </div> );
}
 
export default PageNotFound;