import ilustration from '@/assets/ilustrations/undraw_cancel.svg';

const NotAuthorizedPage = () => {
    return ( <div className="flex flex-col gap-3 justify-center items-center h-full">

        <h1 className='font-bold text-xl '>Ops!</h1>
        <p className='text-red-500'>Você não tem autorização para acessar</p>
        
        <img src={ilustration} className='w-96 my-8'/>
    </div> );
}
 
export default NotAuthorizedPage;