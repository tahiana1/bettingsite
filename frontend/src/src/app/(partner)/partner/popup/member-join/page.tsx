import PendingUserPage from "../../users/pending/page";
import PopupHeader from "@/components/partner/popupHeader";

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