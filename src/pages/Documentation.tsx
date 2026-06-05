import { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { docsModule } from '../docs';
import { DocPage } from '../docs/registry';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CorexLoader } from '@/components/shared/loading/corex';

interface TreeNode extends DocPage {
  children: TreeNode[];
}

const NavItem = ({ node, level = 0, currentPath, onNavigate }: { node: TreeNode, level?: number, currentPath: string, onNavigate: () => void }) => {
  const isActive = currentPath === node.path;
  const hasChildren = node.children.length > 0;
  
  const isChildActive = (n: TreeNode): boolean => {
    if (n.path === currentPath) return true;
    return n.children.some(isChildActive);
  };
  
  const [isExpanded, setIsExpanded] = useState(() => isChildActive(node));

  useEffect(() => {
    if (isChildActive(node)) {
      setIsExpanded(true);
    }
  }, [currentPath, node]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isActive && hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    } else {
      onNavigate();
    }
  };

  return (
    <li className="flex flex-col">
      <motion.div 
        className={`flex items-center justify-between pr-2 py-1.5 rounded-lg text-sm transition-colors font-medium ${
          isActive 
            ? 'bg-white/10 text-white' 
            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
        }`} 
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link 
          to={`/documentation/${node.path}`}
          onClick={handleLinkClick}
          className="flex items-center gap-3 flex-1 py-0.5 outline-none"
        >
          {node.emoji && <span className={`w-5 text-center font-emoji transition-all ${isActive ? "" : "opacity-50"}`}>{node.emoji}</span>}
          {node.title}
        </Link>

        {hasChildren && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white flex items-center justify-center transition-colors outline-none"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronRight size={14} />
            </motion.div>
          </button>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.ul 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mt-1 space-y-1"
          >
            {node.children.map(child => (
              <NavItem 
                key={child.path} 
                node={child} 
                level={level + 1} 
                currentPath={currentPath} 
                onNavigate={onNavigate} 
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default function Docs() {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pages = docsModule.getPages();
  const currentPath = path || pages[0]?.path;
  const currentPage = docsModule.getPage(currentPath);

  const MotionLink = motion.create(Link);

  const treeNodes: Record<string, TreeNode> = {};
  pages.forEach(p => {
    treeNodes[p.path] = { ...p, children: [] };
  });

  const rootNodes: TreeNode[] = [];
  pages.forEach(p => {
    if (p.parent && treeNodes[p.parent]) {
      treeNodes[p.parent].children.push(treeNodes[p.path]);
    } else {
      rootNodes.push(treeNodes[p.path]);
    }
  });

  const sortTree = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.priority - b.priority);
    nodes.forEach(n => sortTree(n.children));
  };
  sortTree(rootNodes);

  const categories = rootNodes.reduce((acc, node) => {
    if (!acc[node.category]) acc[node.category] = [];
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, Array<TreeNode>>);

  const sortedCategories = Object.entries(categories).sort(([catA], [catB]) => {
    const weightA = docsModule.getCategoryPriority(catA);
    const weightB = docsModule.getCategoryPriority(catB);
    return weightA - weightB;
  });

  const flattenTree = (nodes: Array<TreeNode>): Array<TreeNode> => {
    let result: Array<TreeNode> = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  };

  const visualOrder: Array<TreeNode> = [];
  sortedCategories.forEach(([_, catNodes]) => {
    visualOrder.push(...flattenTree(catNodes));
  });

  useEffect(() => {
    if (!path && visualOrder.length > 0) {
      navigate(`/documentation/${visualOrder[0].path}`, { replace: true });
    }
  }, [path, navigate, visualOrder]);

  if (!currentPage) {
    return (
      <div className="min-h-screen bg-surface-950 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <Link to="/documentation" className="text-white hover:underline">Back to documentation</Link>
      </div>
    );
  }

  const currentIndex = visualOrder.findIndex(p => p.path === currentPath);
  const prevPage = currentIndex > 0 ? visualOrder[currentIndex - 1] : null;
  const nextPage = currentIndex < visualOrder.length - 1 ? visualOrder[currentIndex + 1] : null;

  return (
    <>
    <Header />
    <div className="min-h-screen bg-surface-950 text-white flex flex-col font-sans pt-32 pb-12">
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative px-4 lg:px-8">
        
        <aside 
          className={`
            fixed z-50 bg-[#0f0f0f] flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden
            top-0 left-0 h-full w-[85vw] max-w-[320px] rounded-r-2xl border-r border-white/5
            /* Возвращаем фон, обводку и скругления, увеличиваем отступ сверху (top-32) */
            lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] lg:w-[280px] lg:max-w-none lg:rounded-xl lg:border lg:border-white/5 lg:translate-x-0 lg:z-10
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 shrink-0">
            <span className="font-syne font-bold text-white uppercase tracking-wider text-sm">Navigation</span>
            <button 
              className="text-gray-400 hover:text-white p-1 -mr-1 transition-colors outline-none" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 lg:p-4 custom-scrollbar" data-lenis-prevent>
            <div className="space-y-6">
              {sortedCategories.map(([category, catNodes]) => (
                <div key={category}>
                  <h3 className="text-[15px] font-bold text-white mb-2 px-3 tracking-wide uppercase flex items-center gap-2">
                    <span className="text-[17px] font-emoji text-white">{docsModule.getCategoryEmoji(category)}</span>
                    {category}
                  </h3>
                  <ul className="space-y-0.5">
                    {catNodes.map(node => (
                      <NavItem 
                        key={node.path} 
                        node={node} 
                        currentPath={currentPath} 
                        onNavigate={() => setIsMobileMenuOpen(false)} 
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 py-0 px-6 lg:px-12 xl:px-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 uppercase tracking-wider font-bold">
              <img src="/favicon.svg" alt="Corex" className="w-4 h-4 opacity-50" />
              {currentPage.category}
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl text-white flex items-center gap-4 font-unbounded font-bold">
                {currentPage.emoji && <span className="text-4xl font-emoji">{currentPage.emoji}</span>}
                {currentPage.title}
              </h1>
            </div>

            <div className="prose prose-invert prose-red max-w-none [&_h1]:scroll-mt-64 [&_h2]:scroll-mt-64 [&_h3]:scroll-mt-64 [&_h4]:scroll-mt-64">
              <Suspense fallback={<CorexLoader />}>
                <currentPage.component />
              </Suspense>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              {prevPage ? (
                <MotionLink 
                  to={`/documentation/${prevPage.path}`} 
                  className="flex-1 p-4 rounded-xl border border-white/10 hover:border-white/50 
                          hover:bg-white/5 transition-all group flex flex-col items-start"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs text-gray-500 mb-1 flex items-center gap-1"><ChevronLeft size={14}/> Previous</span>
                  <span className="text-lg font-medium text-white group-hover:text-white transition-colors">{prevPage.title}</span>
                </MotionLink>
              ) : <div className="flex-1"></div>}
              
              {nextPage ? (
                <MotionLink to={`/documentation/${nextPage.path}`} 
                  className="flex-1 p-4 rounded-xl border border-white/10 hover:border-white/50 
                          hover:bg-white/5 transition-all group flex flex-col items-end text-right"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">Next <ChevronRight size={14}/></span>
                  <span className="text-lg font-medium text-white group-hover:text-white transition-colors">{nextPage.title}</span>
                </MotionLink>
              ) : <div className="flex-1"></div>}
            </div>
          </div>
        </main>

        <aside className="hidden xl:block w-64 shrink-0 pr-8 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto" data-lenis-prevent>
          {currentPage.toc && currentPage.toc.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-4 bg-white/5 px-3 py-1.5 rounded-full inline-block">On this page</h4>
              <ul className="space-y-2.5 text-sm border-l border-white/10 ml-2 pl-4">
                {currentPage.toc.map(item => (
                  <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 12}px` }}>
                    <a 
                      href={`#${item.id}`} 
                      className="text-gray-400 hover:text-white transition-colors block truncate"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
    <Footer />
    </>
  );
}