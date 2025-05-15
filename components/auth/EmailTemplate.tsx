import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  code
}) => (
  <div className='space-y-4'>
    <h1 className='text-xl font-semibold text-center'>Bienvenido, {username}!</h1>
    <p className='text-gray-500'>Este es el código de verificación</p>
    <p className='text-gray-700 font-medium'>{code}</p>
    <p className='text-gray-500'>Gracias por registrarte en nuestra plataforma.</p>
  </div>
);