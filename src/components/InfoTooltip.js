import ok from '../images/ok.png';
import no from '../images/no.png';

export default function InfoTooltip({isOpen, onClose, info}) {

  return (
    <section className={`overlay overlay_for_info ${isOpen && 'overlay_visible'}`}>
      <div className="modal-form modal-form_for_info">
        <button className="modal-form__close" type="button" onClick={onClose}></button>
        <img className="modal-form__image" src={info ? ok : no} alt='' />
        <h2 className="modal-form__title modal-form__title_for_info">{
          info ? 'Вы успешно\n зарегистрировались!' : 'Что-то пошло не так!\n Попробуйте ещё раз.'
        }</h2>
      </div>
    </section>
  )
}
