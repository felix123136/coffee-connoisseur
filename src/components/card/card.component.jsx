import Image from "next/legacy/image";
import Link from "next/link";

import styles from "./card.module.css";
import classNames from "classnames";

const Card = ({ id, name, imgUrl }) => {
  return (
    <Link className={styles.cardLink} href={`/coffee-store/${id}`}>
      <div className={classNames("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={imgUrl}
            width={400}
            height={225}
            alt={name}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
