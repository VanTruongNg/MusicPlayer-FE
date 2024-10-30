
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="h-[100vh] flex items-center justify-center relative">
          <div className="absolute bottom-5 right-0 text-white">
          </div>
          {children}
        </div>
      </body>
    </html>
  );
};

export default AuthLayout;
