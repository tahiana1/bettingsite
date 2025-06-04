import PopupHeader from "@/components/Admin/PopupHeader";
import MemberTransferPage from "@/app/(admin)/admin/financals/membertransferhistory/page";

const MemberDeposit = () => {
    return <div>
        <div>
            <PopupHeader title="depositRequest" />
        </div>
        <MemberTransferPage />
    </div>
};

export default MemberDeposit;