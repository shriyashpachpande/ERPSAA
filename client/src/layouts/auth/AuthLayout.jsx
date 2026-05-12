import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-[#F3F4F6]">
      <div className="z-10 w-full max-w-6xl mx-auto p-4 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
