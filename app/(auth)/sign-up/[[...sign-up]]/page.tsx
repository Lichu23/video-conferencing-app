import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="flex flex-center h-screen w-full">
      <SignUp />
    </main>
  );
};

export default SignUpPage;
