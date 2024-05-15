import AuthButton from "./authButton/page";

const UserSessionInfo = ({ session }: { session: any }) => (
    <span className="fixed top-4 left-40 max-tablet:left-28 text-white z-30">
        <AuthButton />
    </span>
);

export default UserSessionInfo;
