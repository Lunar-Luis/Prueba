import React, { useState, useEffect } from 'react';
import { BsBoxSeam, BsTruck, BsUpcScan, BsGeoAlt, BsBuilding, BsExclamationTriangle } from "react-icons/bs";

// Componentes Atómicos y Moleculares
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { SearchSelect } from '../molecules/SearchSelect';
import { SmartInput } from '../atoms/SmartInput'; 

// Funciones de API
import { obtenerMarcas, obtenerLineas, obtenerPresentaciones } from '../../api/medicamentos';

interface Props {
  onGuardar: (datos: any) => void;
}

export const RecepcionForm: React.FC<Props> = ({ onGuardar }) => {
  const [modo, setModo] = useState<'NUEVO' | 'EXISTENTE'>('NUEVO');
  const [listas, setListas] = useState({
    marcas: [] as any[],
    lineas: [] as any[],
    formas: [] as any[]
  });

  // ✅ CORRECCIÓN 1: Inicializamos cantidad como string '' para evitar conflictos de tipo en el input
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', 
    descripcion: '', concentracion: '', formaFarmaceutica: '',
    marca: '', linea: '',
    lote: '', vencimiento: '', 
    cantidad: '', // Antes era 0, ahora es '' (string)
    ubicacion: '', proveedor: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const hoy = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const cargarCatalogos = async () => {
        try {
            const [m, l, p] = await Promise.all([
                obtenerMarcas(),
                obtenerLineas(),
                obtenerPresentaciones()
            ]);
            setListas({ marcas: m, lineas: l, formas: p });
        } catch (error) { 
            console.error("Error cargando listas:", error); 
        }
    };
    cargarCatalogos();
  }, []);

  const handleSelectExistente = (med: any) => {
    if (!med) return;
    setModo('EXISTENTE');
    
    // ✅ CORRECCIÓN 2: Uso estricto de || '' para evitar undefined (causa del error controlled/uncontrolled)
    setFormData({
        ...formData,
        codigo: med.codigo || med.medicamentoCodigo || '', 
        nombre: med.nombre || med.nombreMedicamento || '',
        descripcion: med.descripcion || '',
        concentracion: med.concentracion || '',
        // Protegemos el acceso a propiedades anidadas
        formaFarmaceutica: med.presentacion?.nombre || med.formaFarmaceutica || '',
        marca: med.marca?.nombre || med.marca || '',
        linea: med.linea?.nombre || med.linea || '',
        
        // Reseteamos campos logísticos
        lote: '', vencimiento: '', cantidad: '' 
    });
    setFormErrors([]); 
  };

  const handleCreateNew = (nombreEscrito: string) => {
    setModo('NUEVO');
    setFormData({
        codigo: '', nombre: nombreEscrito, 
        descripcion: '', concentracion: '', formaFarmaceutica: '', 
        marca: '', linea: '',
        lote: '', vencimiento: '', cantidad: '', ubicacion: '', proveedor: ''
    });
    setFormErrors([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === 'codigo') {
        nuevoValor = value.toUpperCase().replace(/[^A-Z0-9\-]/g, ""); 
    }
    else if (name === 'cantidad') {
        // Validación estricta para input numérico
        if (value !== '' && !/^\d+$/.test(value)) return; 
        if (value.length > 1 && value.startsWith('0')) nuevoValor = value.replace(/^0+/, '');
    }
    else if (name === 'lote') {
        nuevoValor = value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
    }
    else if (name !== 'vencimiento') {
        // Limpieza general de caracteres especiales
        nuevoValor = value.replace(/[^a-zA-Z0-9\s\.\,\-\(\)áéíóúÁÉÍÓÚñÑ]/g, "");
    }

    setFormData({ ...formData, [name]: nuevoValor });
    if (formErrors.length > 0) setFormErrors([]);
  };

  const validarIntegridad = (): boolean => {
    const errores: string[] = [];
    
    if (formData.vencimiento && formData.vencimiento < hoy) {
        errores.push("⛔ Error: El lote está vencido.");
    }
    // Convertimos a número para validar
    if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
        errores.push("⚠️ La cantidad debe ser mayor a 0.");
    }
    if (!formData.codigo) {
        errores.push("⚠️ El código es obligatorio.");
    }
    if (modo === 'NUEVO') {
        if (!formData.nombre.trim()) errores.push("El nombre es obligatorio.");
        if (!formData.marca.trim()) errores.push("La marca es obligatoria.");
    }
    if (!formData.lote.trim()) errores.push("El número de lote es obligatorio.");

    setFormErrors(errores);
    return errores.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarIntegridad()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return; 
    }
    
    const usuarioIdGuardado = localStorage.getItem('usuarioId');
    const usuarioIdReal = usuarioIdGuardado ? parseInt(usuarioIdGuardado) : 1;

    // ✅ CORRECCIÓN 3: Convertimos cantidad a número (Int) antes de enviar
    // Esto soluciona el "Error al guardar" si el backend espera un Long/Integer
    const datosFinales = {
        ...formData,
        cantidad: parseInt(formData.cantidad), 
        usuarioId: usuarioIdReal
    };

    onGuardar(datosFinales);

    // Resetear formulario
    setModo('NUEVO');
    setFormData({ 
        codigo: '', nombre: '', descripcion: '', concentracion: '', 
        formaFarmaceutica: '', marca: '', linea: '', 
        lote: '', vencimiento: '', cantidad: '', ubicacion: '', proveedor: '' 
    });
    setFormErrors([]);
  };

  const labelClass = "block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Recepción de Mercancía</h2>
                <p className="text-sm text-gray-500 mt-1">Registre el ingreso de lotes y nuevos productos.</p>
            </div>
            <div className="hidden sm:block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                {modo === 'NUEVO' ? '📝 Ingreso Manual' : '📦 Producto Existente'}
            </div>
        </div>

        {formErrors.length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex">
                    <BsExclamationTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Corrija los siguientes errores:</h3>
                        <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                            {formErrors.map((error, index) => <li key={index}>{error}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible relative z-10">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <BsBoxSeam className="text-blue-600" size={18} />
                    <h3 className="font-bold text-gray-700 text-sm uppercase">Información del Medicamento</h3>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="sm:col-span-1">
                            <label className={labelClass}>Código</label>
                            <div className="relative">
                                <BsUpcScan className="absolute left-3 top-3 text-gray-400 z-10" />
                                <Input 
                                    name="codigo" required placeholder="MED-..." 
                                    value={formData.codigo} onChange={handleChange} 
                                    disabled={modo === 'EXISTENTE'}
                                    className={`pl-10 font-mono focus:bg-white ${modo === 'EXISTENTE' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`} 
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Nombre Comercial</label>
                            <SearchSelect onSelect={handleSelectExistente} onCreateNew={handleCreateNew} />
                        </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${modo === 'EXISTENTE' ? 'opacity-70' : ''}`}>
                         <div>
                            <label className={labelClass}>Concentración</label>
                            <Input name="concentracion" placeholder="Ej: 500mg" value={formData.concentracion} onChange={handleChange} disabled={modo === 'EXISTENTE'} />
                        </div>
                        <div>
                            <label className={labelClass}>Tipo (Forma Farm.)</label>
                            <SmartInput labelId="lista-formas" sugerencias={listas.formas} name="formaFarmaceutica" placeholder="Ej: Tableta" value={formData.formaFarmaceutica} onChange={handleChange} disabled={modo === 'EXISTENTE'} />
                        </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${modo === 'EXISTENTE' ? 'opacity-70' : ''}`}>
                        <div>
                            <label className={labelClass}>Presentación (Empaque)</label>
                            <Input name="descripcion" placeholder="Ej: Caja x 30" value={formData.descripcion} onChange={handleChange} disabled={modo === 'EXISTENTE'} />
                        </div>
                        <div>
                            <label className={labelClass}>Marca / Lab</label>
                            <SmartInput labelId="lista-marcas" sugerencias={listas.marcas} name="marca" placeholder="Ej: Genfar" value={formData.marca} onChange={handleChange} disabled={modo === 'EXISTENTE'} />
                        </div>
                    </div>

                    <div className={`transition-opacity duration-300 ${modo === 'EXISTENTE' ? 'opacity-70' : ''}`}>
                        <label className={labelClass}>Línea Terapéutica</label>
                        <SmartInput labelId="lista-lineas" sugerencias={listas.lineas} name="linea" placeholder="Ej: Analgésicos" value={formData.linea} onChange={handleChange} disabled={modo === 'EXISTENTE'} />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                    <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                        <BsTruck className="text-blue-600" size={18} />
                        <h3 className="font-bold text-blue-800 text-sm uppercase">Datos Logísticos (Lote)</h3>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className={labelClass}>N° Lote Fabricante</label>
                            <Input name="lote" required placeholder="Lote A55..." value={formData.lote} onChange={handleChange} className="border-blue-200 focus:ring-blue-500 bg-blue-50/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Vencimiento</label>
                                <Input type="date" name="vencimiento" required min={hoy} value={formData.vencimiento} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={labelClass}>Cantidad</label>
                                {/* Input tipo texto para mejor control de validación */}
                                <Input type="text" inputMode="numeric" name="cantidad" required value={formData.cantidad} onChange={handleChange} className="font-bold text-gray-800" placeholder="0" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Ubicación</label>
                            <div className="relative">
                                <BsGeoAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                                <Input name="ubicacion" placeholder="Estante A" value={formData.ubicacion} onChange={handleChange} className="pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Proveedor</label>
                            <div className="relative">
                                <BsBuilding className="absolute left-3 top-3 text-gray-400 z-10" />
                                <Input name="proveedor" placeholder="Droguería..." value={formData.proveedor} onChange={handleChange} className="pl-10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button 
                        type="submit" variant="primary"
                        className="flex-none h-10 w-auto px-8 py-0 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-bold bg-blue-600 text-white"
                        style={{ minHeight: '40px' }}
                    >
                        <BsBoxSeam size={18} />
                        <span>Confirmar Entrada</span>
                    </Button>
                </div>
            </div>
        </form>
    </div>
  );
};