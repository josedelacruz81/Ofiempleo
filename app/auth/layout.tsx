import lottieJob from "../../public/JobLottie.json";
import { Logo } from "@/components/littleComponents/Logo";
import { LottieAnimation } from "@/components/littleComponents/LottieAnimation";
import { Card, CardBody} from "@nextui-org/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex items-center justify-center w-full">
      <Card className="w-full md:w-[70%] ">
        <CardBody className="p-4 sm:p-6 md:p-10   grid lg:grid-cols-2 overflow-hidden">
          <section className="   flex flex-col gap-8 ">
            <Logo />
            {children}
          </section>
          <section className=" hidden lg:flex items-center justify-center">
            <picture className="w-full h-full flex flex-col items-center justify-center">
              <LottieAnimation animationData={lottieJob} />
            </picture>
          </section>
        </CardBody>
      </Card>
    </div>
  );
}
