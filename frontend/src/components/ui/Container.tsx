import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}) => {
  return (
    <Component className={`max-w-container-max mx-auto px-gutter ${className}`}>
      {children}
    </Component>
  );
};

export default Container;
