import { useState } from "react";
import styles from "src/styles/event.module.scss";
interface IProps {
  name: string;
  icon: JSX.Element;
  label: string;
  setFieldValue: (
    field: string,
    // eslint-disable-next-line
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
}

export default function CustomSelectComponent(props: IProps) {
  const { name, label, icon, setFieldValue } = props;
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`${styles.network} ${isSelected ? styles.network_selected : ""}`}
      onClick={() => {
        const stateToChange = !isSelected;
        setFieldValue(name, stateToChange);
        setIsSelected(stateToChange);
      }}
    >
      <>{icon}</>
      <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
    </div>
  );
}
