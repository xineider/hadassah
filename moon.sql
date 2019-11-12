-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 08-Nov-2019 às 21:38
-- Versão do servidor: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moon`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `banca`
--

DROP TABLE IF EXISTS `banca`;
CREATE TABLE IF NOT EXISTS `banca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `banca_caixa`
--

DROP TABLE IF EXISTS `banca_caixa`;
CREATE TABLE IF NOT EXISTS `banca_caixa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_banca` int(11) NOT NULL,
  `valor` int(11) NOT NULL,
  `data` date NOT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_banca` (`id_banca`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `caixa`
--

DROP TABLE IF EXISTS `caixa`;
CREATE TABLE IF NOT EXISTS `caixa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_plano` int(11) NOT NULL,
  `valor` double(13,2) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `tipo` tinyint(1) NOT NULL COMMENT '0 - aporte, 1 - saque do aporte, 2 - rendimento, 3 - saque do rendimento, 4 - reaporte',
  `dia_confirmacao` date DEFAULT NULL,
  `confirmado` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 - não confirmado, 1 - confirmado, 2 - negado',
  `carteira` text,
  `arquivo` text,
  `status` text,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_plano` (`id_plano`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `caixa`
--

INSERT INTO `caixa` (`id`, `id_usuario`, `id_plano`, `valor`, `data`, `tipo`, `dia_confirmacao`, `confirmado`, `carteira`, `arquivo`, `status`, `deletado`, `data_cadastro`) VALUES
(1, 1, 3, 10000.00, '2019-08-05', 0, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:42:57'),
(2, 1, 3, 100.00, '2019-08-25', 2, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:43:57'),
(3, 1, 3, 10100.00, '2019-09-05', 4, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:44:57'),
(4, 1, 3, 700.00, '2019-09-13', 0, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:45:57'),
(5, 1, 3, 476.00, '2019-09-25', 2, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:46:57'),
(6, 1, 1, 7000.00, '2019-10-07', 4, NULL, 1, NULL, NULL, NULL, 0, '2019-09-25 22:44:57'),
(7, 25, 3, 11276.00, '2019-11-01', 0, '2019-11-07', 0, NULL, 'argh', 'Comprovante Incorreto', 0, '2019-09-25 22:44:57'),
(8, 25, 3, 774.00, '2019-11-14', 1, '2019-11-07', 0, NULL, NULL, 'Entrar em contato com o Suporte', 0, '2019-09-25 22:44:57'),
(9, 1, 1, 50.00, '2019-11-02', 0, NULL, 0, NULL, NULL, NULL, 0, '2019-11-06 19:53:37'),
(10, 1, 1, 700.00, '2019-11-30', 4, NULL, 1, NULL, NULL, NULL, 0, '2019-11-06 20:19:02'),
(11, 1, 1, 50.00, '2019-11-10', 1, NULL, 1, NULL, NULL, NULL, 0, '2019-11-06 20:33:13'),
(12, 1, 1, 80.00, '2019-11-05', 2, '2019-11-15', 1, NULL, NULL, NULL, 0, '2019-11-08 15:35:21'),
(13, 1, 1, 80.00, '2019-11-16', 3, '2019-11-15', 2, NULL, NULL, NULL, 0, '2019-11-08 15:35:21'),
(14, 1, 1, 80.00, '2019-11-14', 3, '2019-11-15', 1, NULL, NULL, NULL, 0, '2019-11-08 15:35:21'),
(15, 1, 1, 1000.00, '2019-11-01', 0, '2019-11-15', 1, NULL, NULL, NULL, 0, '2019-11-08 15:35:21'),
(16, 1, 1, 75.67, '2019-11-03', 0, '2019-11-15', 2, NULL, NULL, NULL, 0, '2019-11-08 15:35:21'),
(17, 1, 1, 400.00, '2019-11-15', 1, '2019-11-15', 0, NULL, NULL, NULL, 0, '2019-11-08 15:35:21');

-- --------------------------------------------------------

--
-- Estrutura da tabela `log`
--

DROP TABLE IF EXISTS `log`;
CREATE TABLE IF NOT EXISTS `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(50) NOT NULL,
  `method` varchar(50) NOT NULL,
  `rota` varchar(250) NOT NULL,
  `user_agent` text NOT NULL,
  `id_usuario` int(11) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `log`
--

INSERT INTO `log` (`id`, `ip`, `method`, `rota`, `user_agent`, `id_usuario`, `data_cadastro`) VALUES
(1, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:07:26'),
(2, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:13:47'),
(3, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:15:24'),
(4, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:16:42'),
(5, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:17:28'),
(6, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:22:59'),
(7, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:31:44'),
(8, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:32:54'),
(9, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:33:16'),
(10, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:34:16'),
(11, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:34:52'),
(12, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:39:50'),
(13, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:40:00'),
(14, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:40:56'),
(15, '179.233.254.237', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-04 04:43:52'),
(16, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-04 21:13:59'),
(17, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-04 21:29:47'),
(18, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/alterar-senha', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 17:30:46'),
(19, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/alterar-senha', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:05:52'),
(20, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:27:11'),
(21, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:27:25'),
(22, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:27:58'),
(23, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:28:08'),
(24, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 18:28:15'),
(25, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 20:56:06'),
(26, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 20:56:32'),
(27, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:18:33'),
(28, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:19:19'),
(29, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:19:49'),
(30, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:24:29'),
(31, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:24:47'),
(32, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:25:22'),
(33, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:27:28'),
(34, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:28:01'),
(35, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:29:07'),
(36, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:29:26'),
(37, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:29:35'),
(38, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:30:31'),
(39, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/alterar-senha', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:30:36'),
(40, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:31:17'),
(41, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:32:24'),
(42, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:32:39'),
(43, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:42:09'),
(44, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:42:20'),
(45, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/alterar-senha', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:42:28'),
(46, '200.182.181.4', 'POST', '/sistema/administracao/usuarios/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-05 21:44:55'),
(47, '200.182.181.4', 'POST', '/sistema/administracao/plano/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 00:16:58'),
(48, '200.182.181.4', 'POST', '/sistema/administracao/plano/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 00:18:04'),
(49, '200.182.181.4', 'POST', '/sistema/administracao/caixa/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 19:53:38'),
(50, '200.182.181.4', 'POST', '/sistema/administracao/caixa/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:19:02'),
(51, '200.182.181.4', 'POST', '/sistema/administracao/caixa/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:33:08'),
(52, '200.182.181.4', 'POST', '/sistema/administracao/caixa/cadastrar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:33:13'),
(53, '200.182.181.4', 'POST', '/sistema/administracao/caixa/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:49:40'),
(54, '200.182.181.4', 'POST', '/sistema/administracao/caixa/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:49:47'),
(55, '200.182.181.4', 'POST', '/sistema/administracao/caixa/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:49:55'),
(56, '200.182.181.4', 'POST', '/sistema/administracao/caixa/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:50:01'),
(57, '200.182.181.4', 'POST', '/sistema/administracao/caixa/desativar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 20:50:34'),
(58, '200.182.181.4', 'POST', '/sistema/administracao/plano/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 21:26:44'),
(59, '200.182.181.4', 'POST', '/sistema/administracao/plano/atualizar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-06 21:26:51'),
(60, '200.182.181.4', 'POST', '/sistema/administracao/pedido-aporte/negar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36', 1, '2019-11-07 00:07:52'),
(61, '200.182.181.4', 'POST', '/sistema/administracao/pedido-aporte/negar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-07 18:08:30'),
(62, '200.182.181.4', 'POST', '/sistema/administracao/pedido-aporte/aprovar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-07 19:05:00'),
(63, '200.182.181.4', 'POST', '/sistema/administracao/pedido-saque/negar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-07 20:05:47'),
(64, '200.182.181.4', 'POST', '/sistema/administracao/pedido-saque/aprovar', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36', 1, '2019-11-07 20:13:13');

-- --------------------------------------------------------

--
-- Estrutura da tabela `planos`
--

DROP TABLE IF EXISTS `planos`;
CREATE TABLE IF NOT EXISTS `planos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `performance` int(11) NOT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `planos`
--

INSERT INTO `planos` (`id`, `nome`, `performance`, `deletado`, `data_cadastro`) VALUES
(1, '03 Meses', 25, 0, '2019-03-12 19:37:56'),
(2, '06 Meses', 35, 0, '2019-03-12 19:37:56'),
(3, '12 Meses', 60, 0, '2019-03-12 19:37:56'),
(6, 'Geronimo', 21, 1, '2019-11-06 00:16:58');

-- --------------------------------------------------------

--
-- Estrutura da tabela `super_banca`
--

DROP TABLE IF EXISTS `super_banca`;
CREATE TABLE IF NOT EXISTS `super_banca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `super_banca_com_banca`
--

DROP TABLE IF EXISTS `super_banca_com_banca`;
CREATE TABLE IF NOT EXISTS `super_banca_com_banca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_super_banca` int(11) NOT NULL,
  `id_banca` int(11) NOT NULL,
  `deletado` int(11) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_super_banca` (`id_super_banca`),
  KEY `id_banca` (`id_banca`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `super_banca_mes_banca`
--

DROP TABLE IF EXISTS `super_banca_mes_banca`;
CREATE TABLE IF NOT EXISTS `super_banca_mes_banca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_super_banca_com_banca` int(11) NOT NULL,
  `mes` date NOT NULL,
  `porcentagem` int(11) NOT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_super_banca` (`id_super_banca_com_banca`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_conector` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(150) NOT NULL,
  `imagem` varchar(150) NOT NULL DEFAULT 'user-padrao.jpg',
  `nome` varchar(150) NOT NULL,
  `telefone` varchar(150) NOT NULL,
  `nivel` tinyint(1) NOT NULL DEFAULT '3' COMMENT '1 = admin, 2 = gerente, 3 = usuario',
  `hash_login` varchar(150) DEFAULT NULL COMMENT 'hash de login, para verificacao mais segura via ajax alterado a cada login',
  `carteira` text,
  `deletado` tinyint(1) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_conector` (`id_conector`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `id_conector`, `email`, `senha`, `imagem`, `nome`, `telefone`, `nivel`, `hash_login`, `carteira`, `deletado`, `data_cadastro`) VALUES
(1, 0, 'admin@admin.com.br', '745536f0652656dae49565e5fa26152b', 'user-padrao.jpg', 'Administrador', '00 00000 0000', 1, '625df24486e96d4c105cfb1f077ed174', NULL, 0, '2017-11-30 18:49:14'),
(2, 0, 'gerente@gerente.com.br', '745536f0652656dae49565e5fa26152b', 'user-padrao.jpg', 'Gerente', '00 00000 0000', 2, '2125c516247379df72abe007a2714996', NULL, 0, '2017-11-30 18:49:14'),
(3, 2, 'leandro@usuario.com.br', '745536f0652656dae49565e5fa26152b', 'user-padrao.jpg', 'Leandro', '(00) 00000-0000', 3, 'a1e071e70d7817adb97564febe452aa0', NULL, 0, '2017-11-30 18:49:14'),
(25, 2, 'sidnei@adasd', '2205bf28623b1535a81936fb4245f05f', 'user-padrao.jpg', 'Sidnei', '(01) 30213-1232', 3, NULL, '123123123123', 0, '2019-11-04 21:13:59'),
(26, 0, 'aaaaaaaaaaah@teste.com.br', '9fd58dfca22678c63da7c52656b5b712', 'user-padrao.jpg', 'Julio', '(20) 31123-2130', 2, NULL, NULL, 0, '2019-11-04 21:29:46'),
(27, 2, 'alo@teste.com.br', 'b2f1c0ebdec6a694fa12e65efc99da21', 'user-padrao.jpg', 'Cintia', '(31) 23123-1231', 3, NULL, NULL, 0, '2019-11-05 21:25:22'),
(28, 2, 'junioer@gmaisdoa', '54e5c8f1b5ae7bae18c1a42485cad3ab', 'user-padrao.jpg', 'Junior', '(92) 01312-3123', 3, NULL, NULL, 0, '2019-11-05 21:27:28'),
(29, 2, 'teste@asodpas', '88d966a78fa2403dc437004b007f1b56', 'user-padrao.jpg', 'Alessandro', '(21) 31231-2312', 3, NULL, NULL, 0, '2019-11-05 21:28:01'),
(30, 2, 'qweqweqw', 'dfb0102d26c04b3b0a1d94f8b903fe56', 'user-padrao.jpg', 'qweqwe', '(21) 31231-2323', 3, NULL, NULL, 1, '2019-11-05 21:29:06'),
(31, 2, '213123123', 'bed1a17ca7007d4fa0c9f53a94575cd1', 'user-padrao.jpg', '3123123123', '(23) 12312-1312', 3, NULL, NULL, 1, '2019-11-05 21:29:26'),
(32, 2, '213123123123', '50deeb433a49d58645caa70352b2fd19', 'user-padrao.jpg', '12312312312', '(12) 31231-2312', 3, NULL, NULL, 1, '2019-11-05 21:31:16'),
(33, 2, '123123123123', 'e47e65df9163e3b58ad37f87586b2df0', 'user-padrao.jpg', '123123123', '(12) 31231-2312', 3, NULL, NULL, 1, '2019-11-05 21:32:37'),
(34, 2, 'teste@gmail.com', 'df4819b87652468a44ad3a77e7855f48', 'user-padrao.jpg', '21903019230129', '(21) 93012-3129', 3, NULL, NULL, 1, '2019-11-05 21:42:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios_planos`
--

DROP TABLE IF EXISTS `usuarios_planos`;
CREATE TABLE IF NOT EXISTS `usuarios_planos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_plano` int(11) NOT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `deletado` tinyint(4) NOT NULL DEFAULT '0',
  `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_plano` (`id_plano`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usuarios_planos`
--

INSERT INTO `usuarios_planos` (`id`, `id_usuario`, `id_plano`, `data_inicio`, `data_fim`, `deletado`, `data_cadastro`) VALUES
(1, 1, 3, '2019-08-05', '2020-08-05', 0, '2019-09-25 23:18:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
