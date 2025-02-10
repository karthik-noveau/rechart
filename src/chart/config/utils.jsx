import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

import styles from "./styles.module.css";
import { useRef } from "react";

export const CustomTooltip = ({ payload, enablePercentage, label }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className={styles.toolTipContainer}>
      <span className={styles.title}>{label}</span>

      {payload.map((entry) => {
        return (
          <div className={styles.row}>
            <div
              style={{ backgroundColor: entry.fill }}
              className={styles.box}
            />
            <span className={styles.key}>{entry.name}</span>
            <span className={styles.value}>
              {entry.value}
              {enablePercentage && "%"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const CustomLegend = ({
  payload,
  onClick,
  legendRef,
  activeKeys,
  onHover,
}) => {
  const containerRef = useRef(null);
  if (!legendRef?.current?.legendKeys) {
    legendRef.current = { legendKeys: payload };
  }
  const isScrollable =
    containerRef?.current?.scrollWidth > containerRef?.current?.clientWidth;

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft -= container.clientWidth; // Adjust scroll amount as needed
    }
  };

  const handleScrollRight = (e) => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft += container.clientWidth; // Adjust scroll amount as needed
    }
  };

  return (
    <div className={styles.legendWrapper}>
      <div
        className={`${styles.legendContainer} ${
          !isScrollable && styles.scrollable
        }`}
      >
        {isScrollable && (
          <BiSolidLeftArrow
            className={styles.arrowIcon}
            onClick={handleScrollLeft}
          />
        )}
        <div className={styles.legendScrollContainer} ref={containerRef}>
          {legendRef.current.legendKeys.map((entry, index) => {
            const key = entry.dataKey;
            const isActive = activeKeys.includes(key); // Check if this key is active (visible)

            return (
              <label
                className={`${styles.legendItem} ${
                  !isActive && styles.disable
                }`}
                key={`legend-item-${index}`}
                onClick={() => onClick(key)}
                onMouseEnter={() => isActive && onHover(key)}
                onMouseLeave={() => isActive && onHover(null)}
              >
                <div
                  style={{ backgroundColor: entry.color }}
                  className={`${styles.boxFill}`}
                />

                <div className={styles.legendName}>{entry.dataKey}</div>
              </label>
            );
          })}
        </div>
        {isScrollable && (
          <BiSolidRightArrow
            className={styles.arrowIcon}
            onClick={handleScrollRight}
          />
        )}
      </div>
    </div>
  );
};
