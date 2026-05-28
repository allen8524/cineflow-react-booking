import { Link } from 'react-router-dom';

const SupportPage = () => {
  const faqs = [
    { question: '예매 취소는 언제까지 가능한가요?', answer: '상영 시작 전까지 예매내역 화면에서 취소할 수 있습니다.' },
    { question: '결제 후 예매 확인은 어디서 하나요?', answer: '결제 완료 후 예매번호가 발급되며 예매내역에서 관람 일정과 좌석을 확인할 수 있습니다.' },
    { question: '좌석을 선택하다가 화면을 이동해도 괜찮나요?', answer: '선택한 영화와 좌석 정보는 예매 완료 단계까지 이어지도록 유지됩니다.' }
  ];

  return (
    <main className="support-page cinema-page">
      <section className="cinema-page-hero support-hero">
        <div className="container">
          <div className="support-hero__layout">
            <div>
              <span className="section-chip">SUPPORT</span>
              <h1>고객센터</h1>
              <p>예매, 취소, 환불, 관람 안내를 빠르게 확인할 수 있습니다.</p>
            </div>
            <div className="support-contact-strip">
              <div><span>대표번호</span><strong>1544-0000</strong></div>
              <div><span>운영시간</span><strong>09:00 - 18:00</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-page-body">
        <div className="container">
          <div className="support-quick-grid">
            <Link to="/booking" className="support-quick-card is-primary"><b>예매 안내</b><strong>영화 선택부터 결제 완료까지</strong><em>빠른예매 이동</em></Link>
            <a href="#cancel-policy" className="support-quick-card"><b>취소 정책</b><strong>예매 취소와 환불 기준</strong><em>정책 보기</em></a>
            <Link to="/history" className="support-quick-card"><b>예매내역</b><strong>예매번호와 관람 일정 조회</strong><em>내역 확인</em></Link>
          </div>

          <section className="support-section-card" id="cancel-policy">
            <div className="section-headline">
              <span className="section-chip">POLICY</span>
              <h2>취소 · 환불 안내</h2>
              <p>상영 시작 전 예매내역에서 취소를 접수하고 상태를 확인할 수 있습니다.</p>
            </div>
            <ul className="support-link-list">
              <li><strong>상영 전 취소</strong><span>예매내역 화면에서 취소 버튼을 눌러 상태를 변경합니다.</span></li>
              <li><strong>취소 사유 기록</strong><span>입력한 사유는 예매 데이터에 함께 저장됩니다.</span></li>
              <li><strong>내역 확인</strong><span>예매번호와 예매자 정보를 통해 관람 일정을 다시 확인할 수 있습니다.</span></li>
            </ul>
          </section>

          <section className="support-section-card" id="faq">
            <div className="section-headline">
              <span className="section-chip">FAQ</span>
              <h2>자주 묻는 질문</h2>
              <p>예매 전후에 자주 확인하는 내용을 모았습니다.</p>
            </div>
            <div className="support-faq-list support-faq-list--best">
              {faqs.map((faq) => (
                <details className="support-faq-item" key={faq.question}>
                  <summary><h3>{faq.question}</h3></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
