import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth.js";
import { useEffect } from "react";
import { Calendar, Clock, Shield, Stethoscope, Users } from "lucide-react";

// 🔹 Botón base sin ShadCN
const Button = ({
  onClick,
  children,
  size = "md",
  variant = "solid",
  className = "",
}) => {
  const base =
    "rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variants = {
    solid:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow",
    outline:
      "border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// 🔹 Card base sin ShadCN
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-border bg-white/70 backdrop-blur shadow ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="p-6 pb-0">{children}</div>;
const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-2 ${className}`}>{children}</div>
);
const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);
const CardDescription = ({ children }) => (
  <p className="text-gray-600 text-sm">{children}</p>
);

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Agenda Fácilmente",
      description:
        "Reserva tus citas médicas en minutos con nuestro calendario interactivo",
    },
    {
      icon: Users,
      title: "Especialistas Calificados",
      description:
        "Accede a una red de médicos profesionales en diversas especialidades",
    },
    {
      icon: Clock,
      title: "Horarios Flexibles",
      description: "Encuentra el horario perfecto que se ajuste a tu agenda",
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description:
        "Tus datos están protegidos con los más altos estándares de seguridad",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                <Stethoscope className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Tu Salud,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Nuestra Prioridad
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Agenda tus citas médicas de forma rápida y sencilla. Conectamos
              pacientes con los mejores profesionales de la salud.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Comenzar Ahora
              </Button>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="outline"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por qué elegir MediCitas?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una plataforma moderna y eficiente para gestionar tus
            citas médicas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Listo para cuidar tu salud?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Únete a miles de pacientes que ya confían en MediCitas para
              gestionar sus citas médicas
            </p>
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Crear Cuenta Gratuita
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 MediCitas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
