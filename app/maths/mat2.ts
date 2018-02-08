import { Vec2, Vec2_T } from "./vec2";

export class Mat2 {
    
    constructor(private m_00 = 1, private m_01 = 0,
        private m_10 = 0, private m_11 = 1
    ) { };

    static multiply(m1: Mat2, m2: Mat2, out?: Mat2) {
        let m_00 = m1.m_00 * m2.m_00 + m1.m_01 * m2.m_10;
        let m_01 = m1.m_00 * m2.m_01 + m1.m_01 * m2.m_11;
        let m_10 = m1.m_10 * m2.m_00 + m1.m_11 * m2.m_10;
        let m_11 = m1.m_10 * m2.m_01 + m1.m_11 * m2.m_11;

        if (out) {
            out.m_00 = m_00;
            out.m_01 = m_01;
            out.m_10 = m_10;
            out.m_11 = m_11;
        } else {
            return new Mat2(m_00, m_01, m_10, m_11);
        }
    };  
};