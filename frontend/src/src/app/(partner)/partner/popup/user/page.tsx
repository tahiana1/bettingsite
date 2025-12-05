"use client";
import { Tabs } from "antd";
import UserBasicInformation from "./pages/basicInformation";
import { Content } from "antd/es/layout/layout";
import UserCustomerService from "./pages/customerService";
import UserAccountInquiry from "./pages/accountInquiry";
import UserSubscriptionSetting from "./pages/subscriptionSetting";
import UserDirectMemberList from "./pages/directMemberList";
import UserRecommendMemberList from "./pages/recommendMemberList";
import UserSubMemberList from "./pages/submemberList";
import UserIntegratedMoneyDetail from "./pages/integratedMoneyDetail";
import UserPointDetail from "./pages/pointDetail";
import UserCouponDetail from "./pages/couponDetail";
import UserLosingHistory from "./pages/losingHistory";
import UserRollingHistory from "./pages/rollingHistory";
import UserBettingHistory from "./pages/bettingHistory";
import UserActivityHistory from "./pages/activityHistory";
import UserInformationChangeHistory from "./pages/informationChangeHistory";
import UserGeneralStatistics from "./pages/generalStatistics";
import styles from "./userTabs.module.css";
import UserBlackSearch from "./pages/blackSearch";
import UserRollingSetting from "./pages/rollingSetting";
import UserWithdrawDeposit from "./pages/withdrawDeposit";
import UserNoteList from "./pages/noteList";
import { useSearchParams } from "next/navigation";

 const tabs = [
    {
        key: "basicInformation",
        label: <span className="text-black">Basic Information</span>,
        children: <UserBasicInformation />,
    },
    {
        key: "deposit&withdrawal",
        label: <span className="text-black">Deposit & Withdrawal</span>,
        children: <UserWithdrawDeposit />,
    },
    {
        key: "notelist",
        label: <span className="text-black">Note List</span>,
        children: <UserNoteList />,
    },
    {
        key: "customerService",
        label: <span className="text-black">Customer Service</span>,
        children: <UserCustomerService />,
    },
    {
        key: "pointDetail",
        label: <span className="text-black">Point Detail</span>,
        children: <UserPointDetail />,
    },
    {
        key: "rollingHistory",
        label: <span className="text-black">Rolling History</span>,
        children: <UserRollingHistory />,
    },
    {
        key: "bettingHistory",
        label: <span className="text-black">Betting History</span>,
        children: <UserBettingHistory />,
    },
 ]

const PopUpUser: React.FC = () => {
    const searchParams = useSearchParams();
    const userid = searchParams.get('id') || "testuser";

    const updatedTabs = tabs.map(tab => {
        if (tab.key === "basicInformation") {
            return {
                ...tab,
                children: <UserBasicInformation userid={userid} />
            };
        }
        return tab;
    });

    return (
        <Content className="w-full h-full bg-white p-3 bg-[white]">
            <Tabs items={updatedTabs} className={styles.customTabs} />
        </Content>
    )
}

export default PopUpUser;