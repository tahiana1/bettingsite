import PopupHeader from "@/components/Admin/PopupHeader";
import RollingConversionPage from "../../settlements/rollingconversionhistory/page";

const RollingConversion = () => {
    return <div>
        <div>
            <PopupHeader title="rollingConversion" />
        </div>
        <RollingConversionPage />
    </div>
};

export default RollingConversion;