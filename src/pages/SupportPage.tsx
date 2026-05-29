import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

const SupportPage = () => {
  const faqs = [
    { question: '예매 취소는 언제까지 가능한가요?', answer: '상영 시작 전까지 예매내역 화면에서 취소할 수 있습니다.' },
    { question: '결제 후 예매 확인은 어디서 하나요?', answer: '예매내역에서 예매번호와 관람 일정, 좌석 정보를 확인할 수 있습니다.' },
    { question: '좌석 선택 중 화면을 이동해도 괜찮나요?', answer: '선택한 상영 정보와 좌석은 결제 완료 전까지 단계별로 다시 확인할 수 있습니다.' }
  ];

  return (
    <main className="support-page cinema-page">
      <PageHero
        className="support-hero"
        title="고객센터"
        description="예매, 취소, 환불, 관람 안내를 빠르게 확인할 수 있습니다."
        sideContent={(
          <div className="support-contact-strip">
            <div>
              <span>대표번호</span>
              <strong>1544-0000</strong>
            </div>
            <div>
              <span>운영시간</span>
              <strong>09:00 - 18:00</strong>
            </div>
          </div>
        )}
      />

      <section className="cinema-page-body">
        <div className="container">
          <div className="support-quick-grid">
            <Link to="/booking" className="support-quick-card is-primary">
              <strong>영화 선택부터 결제 완료까지</strong>
              <span>원하는 상영 시간과 좌석을 고르고 바로 예매할 수 있습니다.</span>
              <em>빠른예매 이동</em>
            </Link>
            <a href="#cancel-policy" className="support-quick-card">
              <strong>예매 취소와 환불 기준</strong>
              <span>상영 전 취소 절차와 취소 사유 기록 방법을 확인하세요.</span>
              <em>정책 보기</em>
            </a>
            <Link to="/history" className="support-quick-card">
              <strong>예매번호와 관람 일정 조회</strong>
              <span>예매 상태, 좌석, 취소 결과를 한 화면에서 확인할 수 있습니다.</span>
              <em>내역 확인</em>
            </Link>
          </div>

          <section className="support-section-card" id="cancel-policy">
            <div className="section-headline">
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
              <h2>자주 묻는 질문</h2>
              <p>예매 전후에 자주 확인하는 내용을 모았습니다.</p>
            </div>
            <div className="support-faq-list support-faq-list--best">
              {faqs.map((faq) => (
                <article className="support-faq-item" key={faq.question}>
                  <span className="support-faq-badge">Q</span>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
