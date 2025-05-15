import ProfileModal from "@/components/modals/InterceptingModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfileModal>{children}</ProfileModal>;
}
