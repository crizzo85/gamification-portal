import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as DiIcons from 'react-icons/di'; // Devicons
import * as VscIcons from 'react-icons/vsc'; // VS Code Icons
import * as RiIcons from 'react-icons/ri'; // Remix Icon
import * as HiIcons from 'react-icons/hi'; // Heroicons
import * as FiIcons from 'react-icons/fi'; // Feather Icons
import * as AiIcons from 'react-icons/ai'; // Ant Design Icons

interface SvgIconProps {
  name: string; // es. "FaCode", "MdBugReport", "IoAccessibilityOutline"
  className?: string;
  fill?: string;
}

const iconLibraries: { [key: string]: any } = {
  Fa: FaIcons,
  Md: MdIcons,
  Io: IoIcons,
  Bs: BsIcons,
  Di: DiIcons,
  Vsc: VscIcons,
  Ri: RiIcons,
  Hi: HiIcons,
  Fi: FiIcons,
  Ai: AiIcons,
};

const SvgIcon: React.FC<SvgIconProps> = ({ name, className, fill = "currentColor" }) => {
  // Estrai il prefisso (es. "Fa", "Md") dal nome dell'icona
  const prefix = name.substring(0, 2); 
  const IconLibrary = iconLibraries[prefix];

  if (!IconLibrary) {
    console.warn(`Libreria icone non trovata per il prefisso: ${prefix}`);
    return null; // O un'icona di fallback
  }

  const IconComponent = IconLibrary[name as keyof typeof IconLibrary];

  if (!IconComponent) {
    console.warn(`Icona non trovata: ${name} nella libreria ${prefix}`);
    return null; // O un'icona di fallback
  }

  return <IconComponent className={className} style={{ color: fill }} />;
};

export default SvgIcon;