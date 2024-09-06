import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiMail,
  PiSignOutBold,
  RiArrowLeftDoubleFill,
  HiOutlineBell,
  MdOutlineKeyboardDoubleArrowRight,
} from "../React-Icons";

interface HeaderMenuProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const HeaderMenuContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  width: 100%;
  position: absolute;
  top: 0;
  box-shadow: 0px 3px 10px #00000005;

  &.sidebar__open {
    margin-left: 19rem;
    width: -webkit-fill-available;
  }
`;

const ToggleSidebarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const HeaderMenuTitle = styled.h1`
  position: absolute;
  left: 3rem;
  top: 0.4rem;
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-right: 1rem;
`;

const IconContainer = styled.div`
  position: relative;
  margin-left: 1rem;

  svg {
    font-size: 1.5rem;
    color: #333;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #e23428;
  color: #fff;
  border-radius: 50%;
  padding: 0.1rem 0.3rem;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [unreadMessages] = useState<number>(5);
  const [currentMonthReservations] = useState<number>(12);

  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUsername");
      navigate("/");
    }
  };

  return (
    <HeaderMenuContainer className={isSidebarOpen ? "sidebar__open" : ""}>
      <ToggleSidebarButton onClick={onToggleSidebar}>
        {isSidebarOpen ? (
          <RiArrowLeftDoubleFill />
        ) : (
          <MdOutlineKeyboardDoubleArrowRight />
        )}
      </ToggleSidebarButton>
      <HeaderMenuTitle>Dashboard</HeaderMenuTitle>
      <HeaderIcons>
        <IconContainer>
          <FiMail />
          {unreadMessages > 0 && <Badge>{unreadMessages}</Badge>}
        </IconContainer>

        <IconContainer>
          <HiOutlineBell />
          {currentMonthReservations > 0 && (
            <Badge>{currentMonthReservations}</Badge>
          )}
        </IconContainer>
        <LogoutButton onClick={handleLogout}>
          <PiSignOutBold />
        </LogoutButton>
      </HeaderIcons>
    </HeaderMenuContainer>
  );
};
