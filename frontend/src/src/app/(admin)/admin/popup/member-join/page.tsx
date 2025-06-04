import PendingUserPage from "../../users/pending/page";
import PopupHeader from "@/components/Admin/PopupHeader";

const MemberJoin = () => {
//   return <PendingUserPage />;
    return <div>
        <div>
            <PopupHeader title="waitForMemberApproval" />
        </div>
        <PendingUserPage />
    </div>
};

export default MemberJoin;