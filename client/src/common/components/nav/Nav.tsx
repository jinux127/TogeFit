import { getUserId } from 'common/utils/getUserId';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as SC from './NavStyle';
import Sidebar from './Sidebar';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [userId, setUserId] = useState(getUserId());

  useEffect(() => {
    setUserId(getUserId());
  }, [location]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SC.NavWrapper>
      <SC.NavBurger isOpen={isOpen} onClick={handleClick} />
      <Sidebar isOpen={isOpen} userId={userId} handleClick={handleClick} />
      <Link to="/">
        <SC.Title>HealthCare for you</SC.Title>
      </Link>
      {userId ? (
        <Link to={`/info/exercise/${userId}`}>
          <SC.UserIcon />
        </Link>
      ) : (
        <Link to="/login">
          <SC.LoginButton>Sign in</SC.LoginButton>
        </Link>
      )}
    </SC.NavWrapper>
  );
};

export default Nav;
