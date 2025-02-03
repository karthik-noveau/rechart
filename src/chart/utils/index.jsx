import { Checkbox, ConfigProvider } from "antd";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import styles from "./styles.module.css";

export const CustomLegend = ({ payload, onClick, activeKeys }) => {
  return (
    <div className={styles.legendWrapper}>
      <BiSolidLeftArrow className={styles.arrowIcon} />
      <div className={styles.legendContainer}>
        {payload.map((entry, index) => {
          const key = entry.dataKey;
          const isActive = activeKeys.includes(key);

          return (
            <>
              <label key={`legend-item-${index}`}>
                <ConfigProvider
                  theme={{
                    token: {
                      // Seed Token
                      colorPrimary: entry.color,
                      borderRadius: 6,
                      // Alias Token
                      colorBgContainer: "#f6ffed",
                    },
                  }}
                >
                  <Checkbox
                    className={styles.checkbox}
                    checked={isActive}
                    onChange={() => onClick(entry)}
                  >
                    <span
                      style={{
                        opacity: isActive ? "1" : "0.3",
                        color: entry.color,
                      }}
                    >
                      {entry.value}
                    </span>
                  </Checkbox>
                </ConfigProvider>
              </label>
            </>
          );
        })}
      </div>
      <BiSolidRightArrow  className={styles.arrowIcon}/>
    </div>
  );
};
