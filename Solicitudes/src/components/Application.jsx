import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';


function Application({handleVerification,process, enableHome})
{
    const navigate = useNavigate();

    const createCode = () => 
    {
        const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCode(generatedCode);
        console.log("Generated Code: ", generatedCode);
        return generatedCode;
    }
    
    const compare = () => 
    {
        if(code === verification)
        {
            enableHome(true);
            setVerification('');
            navigate('/home');
            console.log("Code verified successfully!");
        }
    }

    const [code, setCode] = useState();
    const [verification, setVerification] = useState('');
 
    useEffect(() => 
        {
            createCode();
        },[]);

    return (
       <div className='w-full flex items-center justify-center flex-col mt-3'>
         <button
              className='bg-blue-800 hover:bg-blue-500 text-white rounded-md p-2 w-[60%]'
              onClick={handleVerification}
            >
              Enviar verificación
        </button>
        {process && (
          <div className='flex flex-col items-center mt-4 w-full max-w-md mt-5'>
            <p className='text-gray-700 mt-2  text-sm text-center'>
            Verificación enviada. Por favor, revise su correo e ingrese el siguiente código.
            </p>
            <div className="flex flex-col items-center mt-4 w-[70%]">
            <input
                type="text"
                maxLength={6}
                value={verification}
                onChange={(e) => setVerification(e.target.value.toUpperCase())}
                placeholder="Código de verificación"
                className="border border-gray-300 rounded-md p-2 mb-2 w-full text-center tracking-widest text-sm"
            />
            <button 
                className=" bg-blue-700 hover:bg-blue-300 text-white text-xs w-[70%] rounded-md p-2 mt-2 transition"
                onClick={compare}
            >
                Verificar código
            </button>
            </div>
        </div>
        )}
       </div>
    );
}

export default Application;