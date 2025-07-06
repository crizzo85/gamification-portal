import React, { useState } from 'react';
import SvgIcon from './SvgIcon';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

// Definisci le icone per categoria, con un'icona rappresentativa per ciascuna
const iconCategories = {
  "Programmazione": {
    representativeIcon: 'FaCode',
    icons: [
      'FaCode', 'FaLaptopCode', 'FaTerminal', 'FaFileCode', 'FaBug', 'FaGitAlt', 'FaJs', 'FaPython', 'FaJava', 'FaHtml5', 'FaCss3Alt', 'FaReact', 'FaNodeJs', 'FaPhp', 'FaCplusplus', 'FaCsharp', 'FaSwift', 'FaGofore', 'FaRust', 'FaVuejs', 'FaAngular', 'FaDocker', 'FaKubernetes', 'FaAws', 'FaGoogle', 'FaMicrosoft', 'FaApple', 'FaLinux', 'FaWindows', 'FaAndroid', 'FaAppStoreIos', 'FaChrome', 'FaFirefox', 'FaEdge', 'FaSafari', 'FaWordpress', 'FaShopify', 'FaMagento', 'FaDrupal', 'FaJoomla', 'FaConfluence', 'FaJira', 'FaBitbucket', 'FaGithub', 'FaGitlab', 'FaStackOverflow', 'FaDev', 'FaFreeCodeCamp', 'FaCodepen', 'FaJsfiddle', 'FaNpm', 'FaYarn', 'FaGulp', 'FaGrunt', 'FaWebpack', 'FaBabel', 'FaSass', 'FaLess', 'FaStylus', 'FaBootstrap',
    ],
  },
  "Networking": {
    representativeIcon: 'FaNetworkWired',
    icons: [
      'FaNetworkWired', 'FaServer', 'FaCloud', 'FaWifi', 'FaEthernet', 'FaRouter', 'FaFirewall', 'FaGlobe', 'FaSatelliteDish', 'FaBroadcastTower', 'FaPlug', 'FaLink', 'FaUnlink', 'FaExchangeAlt', 'FaRandom', 'FaSitemap', 'FaDns', 'FaVpn', 'FaCloudUploadAlt', 'FaCloudDownloadAlt', 'FaCloudMeatball', 'FaCloudSun', 'FaCloudMoon', 'FaCloudShowersHeavy', 'FaCloudRain', 'FaCloudSunRain', 'FaCloudMoonRain', 'FaCloudShowersHeavy', 'FaCloudRain', 'FaCloudSunRain', 'FaCloudMoonRain',
    ],
  },
  "Database": {
    representativeIcon: 'FaDatabase',
    icons: [
      'FaDatabase', 'FaServer', 'FaTable', 'FaThList', 'FaTh', 'FaKey', 'FaLock', 'FaUnlock', 'FaSearch', 'FaFilter', 'FaSort', 'FaSortUp', 'FaSortDown', 'FaPlus', 'FaMinus', 'FaEdit', 'FaTrash', 'FaSave', 'FaUndo', 'FaRedo', 'FaSync', 'FaDownload', 'FaUpload', 'FaFileExport', 'FaFileImport', 'FaFileCsv', 'FaFileExcel', 'FaFilePdf', 'FaFileAlt', 'FaFile', 'FaFolder', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus',
    ],
  },
  "Sicurezza Informatica": {
    representativeIcon: 'FaShieldAlt',
    icons: [
      'FaShieldAlt', 'FaLock', 'FaKey', 'FaUserSecret', 'FaFingerprint', 'FaVirus', 'FaHackerNews', 'FaIncognito', 'FaEye', 'FaEyeSlash', 'FaUserLock', 'FaUserShield', 'FaUserNinja', 'FaUserTie', 'FaUserCog', 'FaUserEdit', 'FaUserPlus', 'FaUserMinus', 'FaUserTimes', 'FaUserCheck', 'FaUserFriends', 'FaUserGraduate', 'FaUserMd', 'FaUserNurse', 'FaUserAstronaut', 'FaUserInjured', 'FaUserSlash', 'FaUserTag', 'FaUserAlt', 'FaUserCircle', 'FaUser',
    ],
  },
  "Problem Solving": {
    representativeIcon: 'FaLightbulb',
    icons: [
      'FaLightbulb', 'FaQuestion', 'FaQuestionCircle', 'FaExclamation', 'FaExclamationCircle', 'FaInfo', 'FaInfoCircle', 'FaCheck', 'FaCheckCircle', 'FaTimes', 'FaTimesCircle', 'FaSearch', 'FaFilter', 'FaSort', 'FaSortUp', 'FaSortDown', 'FaPlus', 'FaMinus', 'FaEdit', 'FaTrash', 'FaSave', 'FaUndo', 'FaRedo', 'FaSync', 'FaDownload', 'FaUpload', 'FaFileExport', 'FaFileImport', 'FaFileCsv', 'FaFileExcel', 'FaFilePdf', 'FaFileAlt', 'FaFile', 'FaFolder', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus',
    ],
  },
  "Comunicazione": {
    representativeIcon: 'FaComments',
    icons: [
      'FaComments', 'FaComment', 'FaCommentDots', 'FaCommentAlt', 'FaCommentMedical', 'FaCommentSlash', 'FaCommentDollar', 'FaCommentDots', 'FaCommentAlt', 'FaCommentMedical', 'FaCommentSlash', 'FaCommentDollar', 'FaMicrophone', 'FaMicrophoneAlt', 'FaMicrophoneSlash', 'FaVolumeUp', 'FaVolumeDown', 'FaVolumeMute', 'FaVolumeOff', 'FaPhone', 'FaPhoneAlt', 'FaPhoneSlash', 'FaEnvelope', 'FaEnvelopeOpen', 'FaEnvelopeSquare', 'FaPaperPlane', 'FaShare', 'FaShareAlt', 'FaShareSquare', 'FaReply', 'FaReplyAll', 'FaQuoteLeft', 'FaQuoteRight', 'FaQuoteLeft', 'FaQuoteRight',
    ],
  },
  "Lavoro di Squadra": {
    representativeIcon: 'FaUsers',
    icons: [
      'FaUsers', 'FaUserFriends', 'FaUserPlus', 'FaUserMinus', 'FaUserTimes', 'FaUserCheck', 'FaUserGraduate', 'FaUserMd', 'FaUserNurse', 'FaUserAstronaut', 'FaUserInjured', 'FaUserSlash', 'FaUserTag', 'FaUserAlt', 'FaUserCircle', 'FaUser', 'FaHandshake', 'FaHandsHelping', 'FaPeopleCarry', 'FaChalkboardTeacher', 'FaSchool', 'FaBuilding', 'FaCity', 'FaIndustry', 'FaFactory', 'FaWarehouse', 'FaStore', 'FaStoreAlt', 'FaStoreSlash', 'FaStoreAltSlash', 'FaStore', 'FaStoreAlt', 'FaStoreSlash', 'FaStoreAltSlash',
    ],
  },
  "Creatività": {
    representativeIcon: 'FaPaintBrush',
    icons: [
      'FaPaintBrush', 'FaPalette', 'FaPencilAlt', 'FaPenFancy', 'FaPenNib', 'FaEraser', 'FaFillDrip', 'FaMagic', 'FaHatWizard', 'FaFeatherAlt', 'FaLightbulb', 'FaIdea', 'FaBrain', 'FaFlask', 'FaAtom', 'FaDna', 'FaMicroscope', 'FaSatellite', 'FaRocket', 'FaSpaceShuttle', 'FaRobot', 'FaCubes', 'FaCube', 'FaShapes', 'FaCircle', 'FaSquare', 'FaTriangle', 'FaStar', 'FaHeart', 'FaSmile', 'FaFrown', 'FaMeh', 'FaGrin', 'FaGrinAlt', 'FaGrinBeam', 'FaGrinBeamSweat', 'FaGrinHearts', 'FaGrinSquint', 'FaGrinSquintTears', 'FaGrinStars', 'FaGrinTears', 'FaGrinTongue', 'FaGrinTongueSquint', 'FaGrinTongueWink', 'FaGrinWink', 'FaKiss', 'FaKissBeam', 'FaKissWinkHeart', 'FaLaugh', 'FaLaughBeam', 'FaLaughSquint', 'FaLaughWink', 'FaSadCry', 'FaSadTear', 'FaSmileBeam', 'FaSmileWink', 'FaSurprise', 'FaTired',
    ],
  },
  "Ricerca e Analisi": {
    representativeIcon: 'FaSearch',
    icons: [
      'FaSearch', 'FaSearchPlus', 'FaSearchMinus', 'FaChartBar', 'FaChartPie', 'FaChartLine', 'FaTable', 'FaFilter', 'FaSort', 'FaSortUp', 'FaSortDown', 'FaClipboardList', 'FaClipboardCheck', 'FaClipboard', 'FaClipboardQuestion', 'FaClipboardUser', 'FaClipboardWithCheck', 'FaClipboardWithList', 'FaClipboardWithUser', 'FaClipboardWithQuestion', 'FaClipboardWithCheck', 'FaClipboardWithList', 'FaClipboardWithUser', 'FaClipboardWithQuestion',
    ],
  },
  "Gestione Progetto": {
    representativeIcon: 'FaTasks',
    icons: [
      'FaTasks', 'FaClipboardList', 'FaClipboardCheck', 'FaProjectDiagram', 'FaGanttChart', 'FaCalendarAlt', 'FaCalendarCheck', 'FaCalendarDay', 'FaCalendarWeek', 'FaCalendarMinus', 'FaCalendarPlus', 'FaCalendarTimes', 'FaCalendar', 'FaCheckSquare', 'FaSquare', 'FaCheck', 'FaTimes', 'FaPlusSquare', 'FaMinusSquare', 'FaEdit', 'FaTrash', 'FaSave', 'FaUndo', 'FaRedo', 'FaSync', 'FaDownload', 'FaUpload', 'FaFileExport', 'FaFileImport', 'FaFileCsv', 'FaFileExcel', 'FaFilePdf', 'FaFileAlt', 'FaFile', 'FaFolder', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus', 'FaFolderOpen', 'FaFolderPlus', 'FaFolderMinus',
    ],
  },
  "Hardware": {
    representativeIcon: 'DiApple',
    icons: [
      'DiApple', 'DiWindows', 'DiLinux', 'DiAndroid', 'DiChrome', 'DiFirefox', 'DiEdge', 'DiSafari', 'DiWordpress', 'DiShopify', 'DiMagento', 'DiDrupal', 'DiJoomla', 'DiConfluence', 'DiJira', 'DiBitbucket', 'DiGithub', 'DiGitlab', 'DiStackOverflow', 'DiDev', 'DiFreeCodeCamp', 'DiCodepen', 'DiJsfiddle', 'DiNpm', 'DiYarn', 'DiGulp', 'DiGrunt', 'DiWebpack', 'DiBabel', 'DiSass', 'DiLess', 'DiStylus', 'DiBootstrap',
    ],
  },
  "Sviluppo Web": {
    representativeIcon: 'VscGlobe',
    icons: [
      'VscGlobe', 'VscCode', 'VscTerminal', 'VscJson', 'VscFileCode', 'VscSettingsGear', 'VscExtensions', 'VscGit', 'VscGithub', 'VscGitlab', 'VscNpm', 'VscBug', 'VscLightbulb', 'VscRocket', 'VscCloud', 'VscServer', 'VscDatabase', 'VscShield', 'VscKey', 'VscLock', 'VscUnlock', 'VscSearch', 'VscFilter', 'VscSortAsc', 'VscSortDesc', 'VscCheck', 'VscClose', 'VscAdd', 'VscRemove', 'VscEdit', 'VscTrash', 'VscSave', 'VscRefresh', 'VscArrowLeft', 'VscArrowRight', 'VscArrowUp', 'VscArrowDown', 'VscEye', 'VscEyeClosed', 'VscBell', 'VscWarning', 'VscError', 'VscInfo', 'VscQuestion', 'VscComment', 'VscCommentDiscussion', 'VscFeedback', 'VscMegaphone', 'VscOrganization', 'VscAccount', 'VscMail', 'VscLink', 'VscUnlink', 'VscSettings', 'VscTools', 'VscGear', 'VscBeaker', 'VscFlask', 'VscMicroscope', 'VscTelescope', 'VscRocket', 'VscStar', 'VscHeart', 'VscSmiley', 'VscFrown', 'VscMeh', 'VscGrin', 'VscLaugh', 'VscSad', 'VscSurprise', 'VscTired',
    ],
  },
  "Grafica e UI/UX": {
    representativeIcon: 'RiPaletteLine',
    icons: [
      'RiPaletteLine', 'RiBrushLine', 'RiPencilRulerLine', 'RiCropLine', 'RiPaintFill', 'RiLayoutMasonryLine', 'RiLayoutRowLine', 'RiLayoutColumnLine', 'RiLayoutGridLine', 'RiLayoutLine', 'RiImageLine', 'RiCameraLine', 'RiVideoLine', 'RiEditLine', 'RiCropLine', 'RiMagicLine', 'RiSparkleLine', 'RiStarLine', 'RiHeartLine', 'RiEmotionHappyLine', 'RiEmotionNormalLine', 'RiEmotionSadLine', 'RiEmotionLaughLine', 'RiEmotionUnhappyLine', 'RiEmotionCoolLine', 'RiEmotionLaughLine', 'RiEmotionNormalLine', 'RiEmotionSadLine', 'RiEmotionUnhappyLine', 'RiEmotionCoolLine',
    ],
  },
  "Matematica e Logica": {
    representativeIcon: 'FiHash',
    icons: [
      'FiHash', 'FiPlus', 'FiMinus', 'FiX', 'FiDivide', 'FiPercent', 'FiSquare', 'FiCircle', 'FiTriangle', 'FiTarget', 'FiCompass', 'FiRuler', 'FiFeather', 'FiZap', 'FiCpu', 'FiHardDrive', 'FiMemory', 'FiDisc', 'FiBatteryCharging', 'FiBattery', 'FiPower', 'FiWifi', 'FiBluetooth', 'FiGlobe', 'FiMap', 'FiNavigation', 'FiPin', 'FiFlag', 'FiAward', 'FiTrophy', 'FiGift', 'FiBell', 'FiMessageSquare', 'FiMail', 'FiLink', 'FiPaperclip', 'FiCamera', 'FiVideo', 'FiImage', 'FiFiMusic', 'FiFilm', 'FiBook', 'FiBookmark', 'FiCalendar', 'FiClock', 'FiWatch', 'FiKey', 'FiLock', 'FiUnlock', 'FiSettings', 'FiTool', 'FiSliders', 'FiFilter', 'FiSearch', 'FiZoomIn', 'FiZoomOut', 'FiDownload', 'FiUpload', 'FiExternalLink', 'FiLink2', 'FiShare', 'FiShare2', 'FiCopy', 'FiClipboard', 'FiPaperclip', 'FiTrash', 'FiEdit', 'FiSave', 'FiRefreshCw', 'FiRotateCcw', 'FiRotateCw', 'FiRepeat', 'FiShuffle', 'FiPlay', 'FiPause', 'FiStop', 'FiSkipForward', 'FiSkipBack', 'FiRewind', 'FiFastForward', 'FiVolume', 'FiVolume1', 'FiVolume2', 'FiVolumeX', 'FiMic', 'FiMicOff', 'FiHeadphones', 'FiVideoOff', 'FiCameraOff', 'FiEyeOff', 'FiEye', 'FiHeart', 'FiStar', 'FiThumbsUp', 'FiThumbsDown', 'FiSmile', 'FiMeh', 'FiFrown', 'FiUser', 'FiUsers', 'FiUserPlus', 'FiUserMinus', 'FiUserCheck', 'FiUserX', 'FiUser', 'FiUsers', 'FiUserPlus', 'FiUserMinus', 'FiUserCheck', 'FiUserX',
    ],
  },
  "Generale": {
    representativeIcon: 'AiOutlineStar',
    icons: [
      'AiOutlineStar', 'AiOutlineCheckCircle', 'AiOutlineCloseCircle', 'AiOutlineExclamationCircle', 'AiOutlineInfoCircle',
      'AiOutlineQuestionCircle', 'AiOutlineHome', 'AiOutlineSetting', 'AiOutlineUser', 'AiOutlineTeam', 'AiOutlineMessage',
      'AiOutlineCalendar', 'AiOutlineClockCircle', 'AiOutlineFolder', 'AiOutlineFile', 'AiOutlineDownload', 'AiOutlineUpload',
      'AiOutlineEdit', 'AiOutlineDelete', 'AiOutlineSave', 'AiOutlineReload', 'AiOutlineSearch', 'AiOutlineFilter',
      'AiOutlinePlus', 'AiOutlineMinus', 'AiOutlineLink', 'AiOutlinePaperClip', 'AiOutlineCamera', 'AiOutlineVideoCamera',
      'AiOutlinePicture', 'AiOutlineMusic', 'AiOutlinePlayCircle', 'AiOutlinePauseCircle', 'AiOutlineStop',
    ],
  },
};

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  const [view, setView] = useState('categories'); // 'categories' o 'icons'
  const [currentCategory, setCurrentCategory] = useState('');

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setView('icons');
  };

  const handleBackClick = () => {
    setView('categories');
    setCurrentCategory('');
  };

  if (view === 'icons') {
    const iconsToDisplay = iconCategories[currentCategory as keyof typeof iconCategories]?.icons || [];
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <button onClick={handleBackClick} className="mb-4 flex items-center text-sm text-blue-600 hover:underline">
          <SvgIcon name="IoArrowBackOutline" className="w-4 h-4 mr-1" />
          Torna alle Categorie
        </button>
        <div className="grid grid-cols-6 gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {iconsToDisplay.map((iconName) => (
            <div
              key={iconName}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-md ${selectedIcon === iconName ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-100' : 'hover:bg-gray-200'}`}
              onClick={() => onSelectIcon(iconName)}
            >
              <SvgIcon name={iconName} className="w-6 h-6 text-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="grid grid-cols-10 gap-0.5">
        {Object.entries(iconCategories).map(([categoryName, categoryData]) => (
          <div
            key={categoryName}
            onClick={() => handleCategoryClick(categoryName)}
            className="p-0.5 border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 hover:shadow-lg transition-all aspect-square"
          >
            <SvgIcon name={categoryData.representativeIcon} className="w-4 h-4 mb-0.5 text-blue-600" />
            <span className="text-xs font-semibold text-gray-800 text-center" style={{ fontSize: '0.5rem' }}>{categoryName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;