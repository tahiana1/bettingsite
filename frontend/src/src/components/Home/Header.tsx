import React from "react";
import { Flex, Segmented } from "antd";
import {
  BiJoystick,
  BiTennisBall,
} from "react-icons/bi";
import { MdSports } from "react-icons/md";
import {
  FaBasketball,
  FaFootball,
  FaGolfBallTee,
  FaVolleyball,
} from "react-icons/fa6";
import { SiLivewire } from "react-icons/si";
import { GiAmericanFootballBall } from "react-icons/gi";

const HomeHeader: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented
      size="small"
      className="text-black"
      options={[
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <MdSports className="w-8 h-8 m-auto" />
              <div>All</div>
            </div>
          ),
          value: "user1",
        },
        {
          label: (
            <div className="flex flex-col text-center p-3 mt-[5px] justify-center items-center max-w-18 break-normal whitespace-normal">
              <FaFootball className="w-8 h-8 m-auto" />
              <div>Soccer</div>
            </div>
          ),
          value: "user2",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <FaBasketball className="w-8 h-8 m-auto" />
              <div>Basketball</div>
            </div>
          ),
          value: "user3",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <FaVolleyball className="w-8 h-8 m-auto" />
              <div>Volleyball</div>
            </div>
          ),
          value: "user34",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <FaGolfBallTee className="w-8 h-8 m-auto" />
              <div>Golf</div>
            </div>
          ),
          value: "user35",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <BiJoystick className="w-8 h-8 m-auto" />
              <div>eSports</div>
            </div>
          ),
          value: "user36",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <GiAmericanFootballBall className="w-8 h-8 m-auto" />
              American Football
            </div>
          ),
          value: "user39",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <BiTennisBall className="w-8 h-8 m-auto" />
              <div>Tennis</div>
            </div>
          ),
          value: "user37",
        },
        {
          label: (
            <div className="flex flex-col justify-center p-3 mt-[5px] items-center max-w-18 break-normal whitespace-normal">
              <SiLivewire className="w-8 h-8 m-auto" />
              <div>BJ Live</div>
            </div>
          ),
          value: "user38",
        },
      ]}
    />
  </Flex>
);

export default HomeHeader;
