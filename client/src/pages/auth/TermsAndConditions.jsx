import { Typography, Card, Divider, Tabs, Modal } from "antd";

const { Title, Paragraph, Text } = Typography;

const Section = ({ title, children }) => (
  <Card
    style={{
      marginBottom: 24,
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "#ffffff",
    }}
  >
    <Title level={4} style={{ color: "#0B2C3D", marginBottom: 8 }}>
      {title}
    </Title>
    <Divider style={{ margin: "12px 0" }} />
    <div style={{ color: "#374151" }}>{children}</div>
  </Card>
);

const TermsAndConditions = ({ open, readButton, setOpenModal, setDisabledCheck, closable = false }) => {
  return (
    <Modal
      open={open}
      width={800}
      okText={readButton ? 'I confirm I have read the terms and conditions' : ''}
      //okButtonProps={{style: {display: readButton && 'none'}}}
      footer={readButton ? undefined : null}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={() => {
        setDisabledCheck(false)
        setOpenModal(false)
      }}
      closable={closable}
      destroyOnHidden
      onCancel={() => setOpenModal(false)}

    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto", // 🔥 centra todo horizontalmente
          padding: "0 16px", // espacio lateral en mobile
        }}
      >
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 12,
            background:
              "linear-gradient(90deg, #0B2C3D 0%, #1E7F43 100%)",
            border: "none",
          }}
        >
          <Title style={{ color: "#fff", marginBottom: 0 }}>
            Terms, Conditions & Guidelines
          </Title>
          {/* 🆕 CAMBIO: añadido "Last updated" para que el usuario vea que los términos cambiaron */}
          <Text style={{ color: "#d1fae5" }}>
            Weekly Tennis App · Last updated: October 2026
          </Text>
        </Card>

        <Tabs
          defaultActiveKey="en"
          items={[
            {
              key: "en",
              label: "English",
              children: (
                <>
                  <Section title="Terms and Conditions of Use – Weekly Tennis App">
                    <Paragraph><b>1. Acceptance of Terms</b><br />By accessing or using the Weekly Tennis application (“the App”), you agree to be legally bound by these Terms. If you do not agree, you should stop using the App immediately.</Paragraph>

                    <Paragraph><b>2. Purpose of the App</b><br />The App is a coordination tool designed to help users create, join, and manage tennis matches. It also facilitates communication and handles player queues (including backup players using FIFO logic). However, the App does not guarantee that matches will take place, that players will attend, or that the experience will meet expectations.</Paragraph>

                    <Paragraph><b>3. User Accounts</b><br />Users must provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it. Any misuse or suspicious activity should be reported immediately.</Paragraph>

                    <Paragraph><b>4. Match Participation</b><br />Joining a match does not guarantee a confirmed spot. Matches may include backup players who are invited in order (FIFO system). Users are expected to respond to invitations promptly and attend confirmed matches. Failure to do so may affect future participation.</Paragraph>

                    <Paragraph><b>5. User Conduct</b><br />Users must behave respectfully at all times. This includes avoiding harassment, abusive language, spam, or any attempt to manipulate match systems unfairly. The platform must only be used for tennis-related purposes.</Paragraph>

                    {/* 🆕 CAMBIO: ahora remite a la nueva sección de sanciones */}
                    <Paragraph><b>6. Cancellations, Late Arrivals & No-Shows</b><br />If you cannot attend a match, you are responsible for cancelling in advance. Late arrivals, last-minute cancellations and no-shows are subject to the sanctions described in the “Code of Conduct & Sanctions Policy” section below.</Paragraph>

                    <Paragraph><b>7. Data Usage & Privacy</b><br />The App collects and stores user and match data to provide its services. Authentication may rely on third-party providers (e.g., Firebase). User data is not sold but is used strictly for functionality and improvement of the platform.</Paragraph>

                    <Paragraph><b>8. Liability Disclaimer</b><br />The App is only a coordination tool. We are not responsible for injuries during matches, disputes between players, or issues related to facilities, weather, or third-party services. Participation is at your own risk.</Paragraph>

                    <Paragraph><b>9. Service Availability</b><br />We do not guarantee uninterrupted service. The App may be updated, modified, or temporarily unavailable at any time without prior notice.</Paragraph>

                    {/* 🆕 CAMBIO: deja claro que el cierre de cuenta es posible sin warning previo */}
                    <Paragraph><b>10. Termination</b><br />We reserve the right to suspend or permanently close the account of users who violate these Terms, disrupt the community, or misuse the platform. Depending on the seriousness of the case, this may happen without a prior warning.</Paragraph>

                    <Paragraph><b>11. Changes to Terms</b><br />These Terms may be updated at any time. Continued use of the App after changes implies acceptance of the updated Terms.</Paragraph>

                    <Paragraph><b>12. Governing Law</b><br />These Terms are governed by the laws of Spain. Any disputes will be handled under Spanish jurisdiction.</Paragraph>
                  </Section>


                  <Section title="MTC Guidelines">

                    {/* 🆕 CAMBIO: el registro ahora es online y no requiere formulario ni aprobación de admins */}
                    <Paragraph><b>1. Membership Access</b><br />Joining the community is done by registering online through the App. By creating an account, you agree to these Terms and to the community guidelines described here.</Paragraph>
                    <Paragraph><b>2. Tennis First</b><br />This is a tennis-focused community. Messages and interactions should stay relevant to matches, players, or tennis-related activities.</Paragraph>

                    <Paragraph><b>3. Inclusive & Respectful</b><br />All players are welcome regardless of gender, nationality, or level. Respect is mandatory both on and off the court. Any offensive behavior will not be tolerated.</Paragraph>

                    <Paragraph><b>4. Language Flexibility</b><br />You are free to communicate in either English or Spanish to ensure accessibility for all members.</Paragraph>

                    <Paragraph><b>5. Fair Play & Levels</b><br />Players should honestly assess their skill level (NTRP). Balanced levels ensure fair and enjoyable matches for everyone.</Paragraph>

                    <Paragraph><b>6. On-Court Behaviour</b><br />Avoid coaching or giving instructions unless explicitly requested. Focus on enjoying the game and maintaining a positive environment.</Paragraph>

                    <Paragraph><b>7. Participation & Sharing</b><br />Members are encouraged to share court bookings and organize matches following the established format used by admins.</Paragraph>

                    <Paragraph><b>8. Active Membership</b><br />Users inactive for extended periods (6+ months) may be contacted or removed to maintain an active community.</Paragraph>

                    <Paragraph><b>9. Payments</b><br />Players should only confirm participation after completing payment. Accepted methods include Bizum, Revolut, and PayPal.</Paragraph>

                    <Paragraph><b>10. Weather & Updates</b><br />Weather conditions may affect matches. Stay informed through group messages and updates.</Paragraph>

                    <Paragraph><b>11. Respect Admins</b><br />Admins dedicate time voluntarily. Respect their decisions, coordination, and effort to maintain the community.</Paragraph>

                    {/* 🆕 CAMBIO: ahora incluye puntualidad y remite a la política de sanciones */}
                    <Paragraph><b>12. Punctuality, Cancellations & Accountability</b><br />Be on time and cancel as early as possible. Late arrivals, last-minute cancellations and no-shows are sanctioned according to the Code of Conduct & Sanctions Policy above.</Paragraph>

                  <Paragraph><b>13. Backup Players</b><br/>By joining a match as a backup, you commit to being available to play if a spot opens up. Backups are invited in order (FIFO), so stay attentive to notifications and possible cancellations, and respond to invitations promptly. If your plans change and you can no longer play, please remove yourself from the backup list as soon as possible so the next player can take your place. An assigned backup who does not show up is subject to the Code of Conduct & Sanctions Policy.</Paragraph>

                  </Section>

                  {/* 🆕 CAMBIO: SECCIÓN NUEVA – política de sanciones (EN) */}
                  <Section title="Code of Conduct & Sanctions Policy">
                    <Paragraph>To keep matches fair and enjoyable for everyone, the following sanctions apply. While suspended, your participation in matches is restricted.</Paragraph>

                    <Paragraph>
                      <b>1. Late arrival (15 to 30 minutes)</b><br />
                      1st time: warning · 2nd time: 14-day suspension · 3rd time: 30-day suspension.
                    </Paragraph>

                    <Paragraph>
                      <b>2. Late arrival (31 minutes or more)</b><br />
                      1st time: 21-day suspension · 2nd time: 60-day suspension.
                    </Paragraph>

                    <Paragraph>
                      <b>3. No-show</b><br />
                      Not showing up to a confirmed match: 30-day suspension.
                    </Paragraph>

                    <Paragraph>
                      <b>4. Assigned backup player who does not show up</b><br />
                      1st time: warning · 2nd time: 30-day suspension.
                    </Paragraph>

                    <Paragraph>
                      <b>5. Last-minute cancellation (less than 24 hours before the match)</b><br />
                      1st time: warning · 2nd time: 30-day suspension. A repeated last-minute cancellation counts as a no-show.
                    </Paragraph>

                    <Paragraph>
                      <b>6. Offensive or disrespectful behaviour</b><br />
                      30-day suspension.
                    </Paragraph>

                    <Paragraph>
                      <b>7. Other situations</b><br />
                      Any other conduct that harms the community or the organisation of matches will be handled at the administrators’ discretion.
                    </Paragraph>

                    <Divider style={{ margin: "12px 0" }} />

                    <Paragraph>
                      <b>Administrators’ discretion</b><br />
                      The sanctions above are a reference guide, not a fixed scale. The final decision always rests with the administration, which will consider the seriousness of each incident and the player’s history.
                    </Paragraph>

                    <Paragraph>
                      Depending on the case, administrators may skip the warning and apply a suspension directly, apply a longer suspension than the one listed, or permanently close the account. A player’s previous behaviour, including incidents that occurred before this policy came into effect, may be taken into account.
                    </Paragraph>

                    <Paragraph style={{ marginBottom: 0 }}>
                      Serious misconduct, such as repeated disrespect, discrimination, harassment or aggressive behaviour, may lead to immediate account closure without a prior warning.
                    </Paragraph>
                  </Section>
                  {/* 🆕 FIN CAMBIO */}

                </>
              ),
            },
            {
              key: "es",
              label: "Español",
              children: (
                <>
                  <Section title="Términos y Condiciones de Uso – Weekly Tennis App">
                    <Paragraph><b>1. Aceptación de los Términos</b><br />Al acceder o utilizar la aplicación, aceptas quedar legalmente vinculado a estos términos. Si no estás de acuerdo, debes dejar de usar la App.</Paragraph>

                    <Paragraph><b>2. Propósito de la App</b><br />La App sirve como herramienta para organizar partidos, gestionar jugadores y coordinar la participación. No garantiza asistencia ni calidad de la experiencia.</Paragraph>

                    <Paragraph><b>3. Cuentas de Usuario</b><br />Debes proporcionar información veraz y mantener la seguridad de tu cuenta. Eres responsable de toda actividad realizada con ella.</Paragraph>

                    <Paragraph><b>4. Participación en Partidos</b><br />Unirse a un partido no garantiza plaza. Existe un sistema FIFO de suplentes y se espera respuesta rápida a invitaciones.</Paragraph>

                    <Paragraph><b>5. Conducta del Usuario</b><br />Se requiere respeto en todo momento. No se permite abuso, spam ni manipulación del sistema.</Paragraph>

                    {/* 🆕 CAMBIO: remite a la nueva sección de sanciones */}
                    <Paragraph><b>6. Cancelaciones, Retrasos y Ausencias</b><br />Debes cancelar con antelación si no puedes asistir. Los retrasos, las cancelaciones de última hora y las ausencias se sancionan según la sección “Código de Conducta y Política de Sanciones”.</Paragraph>

                    <Paragraph><b>7. Uso de Datos</b><br />Los datos se utilizan para el funcionamiento de la App y mejora del servicio. No se venden a terceros.</Paragraph>

                    <Paragraph><b>8. Responsabilidad</b><br />La App no se responsabiliza de lesiones, disputas o problemas externos.</Paragraph>

                    <Paragraph><b>9. Disponibilidad</b><br />El servicio puede modificarse o interrumpirse en cualquier momento.</Paragraph>

                    {/* 🆕 CAMBIO: cierre de cuenta posible sin aviso previo */}
                    <Paragraph><b>10. Terminación</b><br />Las cuentas pueden ser suspendidas o cerradas definitivamente por incumplimiento. Según la gravedad del caso, puede hacerse sin aviso previo.</Paragraph>

                    <Paragraph><b>11. Cambios</b><br />Los términos pueden actualizarse en cualquier momento.</Paragraph>

                    <Paragraph><b>12. Legislación Aplicable</b><br />Se rige por la legislación española.</Paragraph>
                  </Section>
                  {/* 🆕 CAMBIO: Guías de MTC en español ampliadas para igualar el detalle de la versión en inglés */}
                  <Section title="Guías de MTC">
                    {/* 🆕 CAMBIO: el registro ahora es online y no requiere formulario ni aprobación de admins */}
                    <Paragraph><b>1. Acceso a la Comunidad</b><br />Para unirte a la comunidad basta con registrarte online a través de la App. Al crear tu cuenta, aceptas estos Términos y las guías de la comunidad aquí descritas.</Paragraph>

                    <Paragraph><b>2. El Tenis es lo Primero</b><br />Esta es una comunidad centrada en el tenis. Los mensajes y las interacciones deben estar relacionados con partidos, jugadores o actividades vinculadas al tenis.</Paragraph>

                    <Paragraph><b>3. Inclusión y Respeto</b><br />Todos los jugadores son bienvenidos, independientemente de su género, nacionalidad o nivel. El respeto es obligatorio dentro y fuera de la pista. No se tolerará ningún comportamiento ofensivo.</Paragraph>

                    <Paragraph><b>4. Flexibilidad de Idioma</b><br />Puedes comunicarte en español o en inglés, para que la comunidad sea accesible para todos sus miembros.</Paragraph>

                    <Paragraph><b>5. Juego Limpio y Niveles</b><br />Los jugadores deben evaluar su nivel (NTRP) con honestidad. Unos niveles equilibrados garantizan partidos justos y agradables para todos.</Paragraph>

                    <Paragraph><b>6. Comportamiento en Pista</b><br />Evita dar consejos o instrucciones a otros jugadores salvo que te lo pidan expresamente. Céntrate en disfrutar del juego y en mantener un ambiente positivo.</Paragraph>

                    <Paragraph><b>7. Participación y Pistas Compartidas</b><br />Animamos a los miembros a compartir sus reservas de pista y a organizar partidos siguiendo el formato establecido por los administradores.</Paragraph>

                    <Paragraph><b>8. Membresía Activa</b><br />Los usuarios que permanezcan inactivos durante periodos prolongados (6 meses o más) podrán ser contactados o dados de baja para mantener una comunidad activa.</Paragraph>

                    <Paragraph><b>9. Pagos</b><br />Los jugadores solo deben confirmar su participación después de haber realizado el pago. Los métodos aceptados son Bizum, Revolut y PayPal.</Paragraph>

                    <Paragraph><b>10. Clima y Novedades</b><br />Las condiciones meteorológicas pueden afectar a los partidos. Mantente informado a través de los mensajes y avisos del grupo.</Paragraph>

                    <Paragraph><b>11. Respeto a los Administradores</b><br />Los administradores dedican su tiempo de forma voluntaria. Respeta sus decisiones, su labor de coordinación y su esfuerzo por mantener la comunidad.</Paragraph>

                    <Paragraph><b>12. Puntualidad, Cancelaciones y Responsabilidad</b><br />Llega a tiempo y cancela lo antes posible si no puedes asistir. Los retrasos, las cancelaciones de última hora y las ausencias se sancionan según lo establecido en el Código de Conducta y Política de Sanciones.</Paragraph>
                    
                    <Paragraph><b>13. Jugadores Suplentes (Backups)</b><br />Al apuntarte a un partido como suplente, te comprometes a estar disponible para jugar si se libera una plaza. Los suplentes se invitan por orden (FIFO), así que mantente atento a las notificaciones y a posibles cancelaciones, y responde a las invitaciones con rapidez. Si tus planes cambian y ya no puedes jugar, retírate de la lista de suplentes lo antes posible para que el siguiente jugador pueda ocupar tu lugar. Un suplente asignado que no se presenta queda sujeto al Código de Conducta y Política de Sanciones.</Paragraph>
                  </Section>
                  {/* 🆕 FIN CAMBIO */}

                  {/* 🆕 CAMBIO: SECCIÓN NUEVA – política de sanciones (ES) */}
                  <Section title="Código de Conducta y Política de Sanciones">
                    <Paragraph>Para que los partidos sean justos y agradables para todos, se aplican las siguientes sanciones. Durante una suspensión, tu participación en partidos queda restringida.</Paragraph>

                    <Paragraph>
                      <b>1. Retraso de 15 a 30 minutos</b><br />
                      1ª vez: aviso · 2ª vez: suspensión de 14 días · 3ª vez: suspensión de 30 días.
                    </Paragraph>

                    <Paragraph>
                      <b>2. Retraso de 31 minutos o más</b><br />
                      1ª vez: suspensión de 21 días · 2ª vez: suspensión de 60 días.
                    </Paragraph>

                    <Paragraph>
                      <b>3. No presentarse</b><br />
                      No acudir a un partido confirmado: suspensión de 30 días.
                    </Paragraph>

                    <Paragraph>
                      <b>4. Suplente asignado que no se presenta</b><br />
                      1ª vez: aviso · 2ª vez: suspensión de 30 días.
                    </Paragraph>

                    <Paragraph>
                      <b>5. Cancelación de última hora (menos de 24 horas antes del partido)</b><br />
                      1ª vez: aviso · 2ª vez: suspensión de 30 días. Una cancelación de última hora repetida cuenta como no presentarse.
                    </Paragraph>

                    <Paragraph>
                      <b>6. Comportamiento ofensivo o irrespetuoso</b><br />
                      Suspensión de 30 días.
                    </Paragraph>

                    <Paragraph>
                      <b>7. Otras situaciones</b><br />
                      Cualquier otra conducta que perjudique a la comunidad o a la organización de los partidos queda a criterio de la administración.
                    </Paragraph>

                    <Divider style={{ margin: "12px 0" }} />

                    <Paragraph>
                      <b>Criterio de la administración</b><br />
                      Las sanciones anteriores son una guía de referencia, no una escala fija. La decisión final corresponde siempre a la administración, que valorará la gravedad de cada caso y el historial del jugador.
                    </Paragraph>

                    <Paragraph>
                      Según el caso, la administración puede omitir el aviso y aplicar directamente una suspensión, aplicar una suspensión más larga que la indicada o cerrar la cuenta de forma definitiva. Se puede tener en cuenta el comportamiento previo del jugador, incluidos los incidentes anteriores a la entrada en vigor de esta política.
                    </Paragraph>

                    <Paragraph style={{ marginBottom: 0 }}>
                      Las faltas graves, como faltas de respeto reiteradas, discriminación, acoso o comportamiento agresivo, pueden suponer el cierre inmediato de la cuenta sin aviso previo.
                    </Paragraph>
                  </Section>
                  {/* 🆕 FIN CAMBIO */}
                </>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default TermsAndConditions;