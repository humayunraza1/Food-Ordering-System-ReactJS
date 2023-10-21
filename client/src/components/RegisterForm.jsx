import styles from "./registerform.module.css"
import ColorStepper from "./ColorStepper";
import LogoComp from "./LogoComp";
import RegisterItems from "./RegisterItems"
import { useState } from "react";




function RegisterForm() {
    const [formStage, setStage] = useState(0);

    return (
        <>

            <LogoComp>
                <ColorStepper stage={formStage} />
                <div className={styles.formContainer}>
                    <form method="post" className={styles.formC}>
                        <RegisterItems formStage={formStage} setStage={setStage} />
                    </form>
                </div>
            </LogoComp>

        </>
    )
}

export default RegisterForm
