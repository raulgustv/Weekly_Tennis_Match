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

const TermsAndConditions = ({open, readButton, setOpenModal, setDisabledCheck, closable=false}) => {
  return (
    <Modal
      open={open}
      width={800}
      okText={readButton ? 'I confirm I have read the terms and conditions' : ''}
      //okButtonProps={{style: {display: readButton && 'none'}}}
      footer={readButton ? undefined : null}
      cancelButtonProps={{style: {display: 'none'}}}
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
        <Text style={{ color: "#d1fae5" }}>
          Weekly Tennis App · 2026
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
                  <Paragraph><b>1. Acceptance of Terms</b><br/>By accessing or using the Weekly Tennis application (“the App”), you agree to be legally bound by these Terms. If you do not agree, you should stop using the App immediately.</Paragraph>

                  <Paragraph><b>2. Purpose of the App</b><br/>The App is a coordination tool designed to help users create, join, and manage tennis matches. It also facilitates communication and handles player queues (including backup players using FIFO logic). However, the App does not guarantee that matches will take place, that players will attend, or that the experience will meet expectations.</Paragraph>

                  <Paragraph><b>3. User Accounts</b><br/>Users must provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it. Any misuse or suspicious activity should be reported immediately.</Paragraph>

                  <Paragraph><b>4. Match Participation</b><br/>Joining a match does not guarantee a confirmed spot. Matches may include backup players who are invited in order (FIFO system). Users are expected to respond to invitations promptly and attend confirmed matches. Failure to do so may affect future participation.</Paragraph>

                  <Paragraph><b>5. User Conduct</b><br/>Users must behave respectfully at all times. This includes avoiding harassment, abusive language, spam, or any attempt to manipulate match systems unfairly. The platform must only be used for tennis-related purposes.</Paragraph>

                  <Paragraph><b>6. Cancellations & No-Shows</b><br/>If you cannot attend a match, you are responsible for cancelling in advance. Repeated last-minute cancellations or no-shows may result in temporary or permanent restrictions within the platform.</Paragraph>

                  <Paragraph><b>7. Data Usage & Privacy</b><br/>The App collects and stores user and match data to provide its services. Authentication may rely on third-party providers (e.g., Firebase). User data is not sold but is used strictly for functionality and improvement of the platform.</Paragraph>

                  <Paragraph><b>8. Liability Disclaimer</b><br/>The App is only a coordination tool. We are not responsible for injuries during matches, disputes between players, or issues related to facilities, weather, or third-party services. Participation is at your own risk.</Paragraph>

                  <Paragraph><b>9. Service Availability</b><br/>We do not guarantee uninterrupted service. The App may be updated, modified, or temporarily unavailable at any time without prior notice.</Paragraph>

                  <Paragraph><b>10. Termination</b><br/>We reserve the right to suspend or permanently remove users who violate these Terms, disrupt the community, or misuse the platform.</Paragraph>

                  <Paragraph><b>11. Changes to Terms</b><br/>These Terms may be updated at any time. Continued use of the App after changes implies acceptance of the updated Terms.</Paragraph>

                  <Paragraph><b>12. Governing Law</b><br/>These Terms are governed by the laws of Spain. Any disputes will be handled under Spanish jurisdiction.</Paragraph>
                </Section>

                <Section title="MTC Guidelines">
                  <Paragraph><b>1. Membership Access</b><br/>Joining the community requires completing the official form and being accepted by administrators. This ensures a controlled and quality player base.</Paragraph>

                  <Paragraph><b>2. Tennis First</b><br/>This is a tennis-focused community. Messages and interactions should stay relevant to matches, players, or tennis-related activities.</Paragraph>

                  <Paragraph><b>3. Inclusive & Respectful</b><br/>All players are welcome regardless of gender, nationality, or level. Respect is mandatory both on and off the court. Any offensive behavior will not be tolerated.</Paragraph>

                  <Paragraph><b>4. Language Flexibility</b><br/>You are free to communicate in either English or Spanish to ensure accessibility for all members.</Paragraph>

                  <Paragraph><b>5. Fair Play & Levels</b><br/>Players should honestly assess their skill level (NTRP). Balanced levels ensure fair and enjoyable matches for everyone.</Paragraph>

                  <Paragraph><b>6. On-Court Behaviour</b><br/>Avoid coaching or giving instructions unless explicitly requested. Focus on enjoying the game and maintaining a positive environment.</Paragraph>

                  <Paragraph><b>7. Participation & Sharing</b><br/>Members are encouraged to share court bookings and organize matches following the established format used by admins.</Paragraph>

                  <Paragraph><b>8. Active Membership</b><br/>Users inactive for extended periods (6+ months) may be contacted or removed to maintain an active community.</Paragraph>

                  <Paragraph><b>9. Payments</b><br/>Players should only confirm participation after completing payment. Accepted methods include Bizum, Revolut, and PayPal.</Paragraph>

                  <Paragraph><b>10. Weather & Updates</b><br/>Weather conditions may affect matches. Stay informed through group messages and updates.</Paragraph>

                  <Paragraph><b>11. Respect Admins</b><br/>Admins dedicate time voluntarily. Respect their decisions, coordination, and effort to maintain the community.</Paragraph>

                  <Paragraph><b>12. Cancellations & Accountability</b><br/>Repeated last-minute cancellations may result in temporary suspension or permanent removal to ensure fairness for all players.</Paragraph>
                </Section>
              </>
            ),
          },
          {
            key: "es",
            label: "Español",
            children: (
              <>
                <Section title="Términos y Condiciones de Uso – Weekly Tennis App">
                  <Paragraph><b>1. Aceptación de los Términos</b><br/>Al acceder o utilizar la aplicación, aceptas quedar legalmente vinculado a estos términos. Si no estás de acuerdo, debes dejar de usar la App.</Paragraph>

                  <Paragraph><b>2. Propósito de la App</b><br/>La App sirve como herramienta para organizar partidos, gestionar jugadores y coordinar la participación. No garantiza asistencia ni calidad de la experiencia.</Paragraph>

                  <Paragraph><b>3. Cuentas de Usuario</b><br/>Debes proporcionar información veraz y mantener la seguridad de tu cuenta. Eres responsable de toda actividad realizada con ella.</Paragraph>

                  <Paragraph><b>4. Participación en Partidos</b><br/>Unirse a un partido no garantiza plaza. Existe un sistema FIFO de suplentes y se espera respuesta rápida a invitaciones.</Paragraph>

                  <Paragraph><b>5. Conducta del Usuario</b><br/>Se requiere respeto en todo momento. No se permite abuso, spam ni manipulación del sistema.</Paragraph>

                  <Paragraph><b>6. Cancelaciones</b><br/>Debes cancelar con antelación si no puedes asistir. Las cancelaciones repetidas pueden implicar sanciones.</Paragraph>

                  <Paragraph><b>7. Uso de Datos</b><br/>Los datos se utilizan para el funcionamiento de la App y mejora del servicio. No se venden a terceros.</Paragraph>

                  <Paragraph><b>8. Responsabilidad</b><br/>La App no se responsabiliza de lesiones, disputas o problemas externos.</Paragraph>

                  <Paragraph><b>9. Disponibilidad</b><br/>El servicio puede modificarse o interrumpirse en cualquier momento.</Paragraph>

                  <Paragraph><b>10. Terminación</b><br/>Las cuentas pueden ser suspendidas por incumplimiento.</Paragraph>

                  <Paragraph><b>11. Cambios</b><br/>Los términos pueden actualizarse en cualquier momento.</Paragraph>

                  <Paragraph><b>12. Legislación Aplicable</b><br/>Se rige por la legislación española.</Paragraph>
                </Section>

                <Section title="Guías de MTC">
                  <Paragraph><b>1. Acceso</b><br/>Requiere aprobación de administradores.</Paragraph>
                  <Paragraph><b>2. Solo Tenis</b><br/>Contenido únicamente relacionado con tenis.</Paragraph>
                  <Paragraph><b>3. Respeto</b><br/>Obligatorio dentro y fuera de la pista.</Paragraph>
                  <Paragraph><b>4. Idioma</b><br/>Español o inglés.</Paragraph>
                  <Paragraph><b>5. Juego Justo</b><br/>Sé honesto con tu nivel.</Paragraph>
                  <Paragraph><b>6. Comportamiento</b><br/>No dar instrucciones sin ser solicitado.</Paragraph>
                  <Paragraph><b>7. Participación</b><br/>Compartir pistas correctamente.</Paragraph>
                  <Paragraph><b>8. Actividad</b><br/>Usuarios inactivos pueden ser eliminados.</Paragraph>
                  <Paragraph><b>9. Pagos</b><br/>Confirmar solo tras pagar.</Paragraph>
                  <Paragraph><b>10. Clima</b><br/>Revisar actualizaciones.</Paragraph>
                  <Paragraph><b>11. Administradores</b><br/>Respetar su trabajo.</Paragraph>
                  <Paragraph><b>12. Cancelaciones</b><br/>Repeticiones implican sanción.</Paragraph>
                </Section>
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
