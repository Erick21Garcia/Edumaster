import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import CoursesSection from "@/components/CoursesSection";

export default function Home() {
    return (
        <MainLayout>
            <HeroSection />
            <BenefitsSection />
            <CoursesSection />
        </MainLayout>
    );
}
