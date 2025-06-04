import PopupHeader from "@/components/Admin/PopupHeader";
import SettlementRequest from "@/app/(admin)/admin/settlements/losingdetail/page";

const TotalSettlement = () => {
    return <div>
        <div>
            <PopupHeader title="totalSettlement" />
        </div>
        <SettlementRequest />
    </div>
};

export default TotalSettlement;